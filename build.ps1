param(
  [string]$PagesDir = "src/pages",
  [string]$PartialsDir = "src/partials",
  [string]$OutputDir = "."
)

function Read-FileUtf8($path) {
  return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

function Write-FileUtf8($path, $content) {
  [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}

$header = Read-FileUtf8 "$PartialsDir/header.html"
$footer = Read-FileUtf8 "$PartialsDir/footer.html"
$pageFiles = Get-ChildItem -Path $PagesDir -Filter "*.html"

$activeMap = @{
  'index' = 'ACTIVE_INDEX'
  'about' = 'ACTIVE_ABOUT'
  'programs' = 'ACTIVE_PROGRAMS'
  'team' = 'ACTIVE_TEAM'
  'blog' = 'ACTIVE_BLOG'
  'parents' = 'ACTIVE_PARENTS'
  'contact' = 'ACTIVE_CONTACT'
}

foreach ($file in $pageFiles) {
  $raw = Read-FileUtf8 $file.FullName
  $meta = @{}
  $body = $raw

  if ($raw.StartsWith('---')) {
    $end = $raw.IndexOf('---', 3)
    $front = $raw.Substring(3, $end - 3).Trim()
    foreach ($line in $front -split "`n") {
      $idx = $line.IndexOf(':')
      if ($idx -gt 0) {
        $key = $line.Substring(0, $idx).Trim()
        $val = $line.Substring($idx + 1).Trim()
        if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
          $val = $val.Substring(1, $val.Length - 2)
        }
        $meta[$key] = $val
      }
    }
    $body = $raw.Substring($end + 3).Trim()
  }

  $pageKey = $file.BaseName
  $slug = if ($pageKey -eq 'index') { '' } else { $pageKey }
  $canonicalUrl = "https://ecole-integrale-agadir.pages.dev/$slug"

  $html = $header

  foreach ($kvp in $meta.GetEnumerator()) {
    $html = $html -replace [regex]::Escape("{{$($kvp.Key.ToUpper())}}"), $kvp.Value
  }

  $html = $html -replace [regex]::Escape("{{CANONICAL_URL}}"), $canonicalUrl
  $html = $html -replace [regex]::Escape("{{OG_TYPE}}"), 'website'

  $activeKey = if ($activeMap.ContainsKey($pageKey)) { $activeMap[$pageKey] } else { 'ACTIVE_INDEX' }

  foreach ($key in $activeMap.Values) {
    if ($key -eq $activeKey) {
      $html = $html -replace [regex]::Escape("{{$key}}"), 'active'
    } else {
      $html = $html -replace [regex]::Escape("{{$key}}"), ''
    }
  }

  $html = "$html`r`n$body`r`n$footer"

  $outPath = Join-Path $OutputDir $file.Name
  Write-FileUtf8 $outPath $html
  Write-Host "Built $($file.Name)"
}

$adminSrc = "src/admin"
$adminOut = "admin"
if (Test-Path $adminSrc) {
  if (-not (Test-Path $adminOut)) { New-Item -ItemType Directory -Path $adminOut -Force | Out-Null }
  Get-ChildItem -Path $adminSrc | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination "$adminOut/$($_.Name)" -Force
    Write-Host "Copied admin/$($_.Name)"
  }
}

Write-Host "Site build complete"
