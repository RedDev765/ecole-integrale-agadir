$sites = @('international', 'haut-founty')

function Read-FileUtf8($path) {
  return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

function Write-FileUtf8($path, $content) {
  [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}

function AbsAssets($html) {
  $pattern = '(href|src)="(css/|js/|images/|manifest\.json)'
  return $html -replace $pattern, '$1="/$2'
}

$internalTargets = @('', '/about', '/programs', '/team', '/blog', '/parents', '/contact')
function PrefixLinks($html, $base) {
  foreach ($t in $internalTargets) {
    if ($t -eq '') {
      $pattern = 'href="/"'
      $replacement = "href=`"$base/`""
    } else {
      $escaped = [regex]::Escape($t)
      $pattern = "href=`"$escaped`""
      $replacement = "href=`"$base$t`""
    }
    $html = $html -replace $pattern, $replacement
  }
  return $html
}

$activeMap = @{
  'index'    = 'ACTIVE_INDEX'
  'about'    = 'ACTIVE_ABOUT'
  'programs' = 'ACTIVE_PROGRAMS'
  'team'     = 'ACTIVE_TEAM'
  'blog'     = 'ACTIVE_BLOG'
  'parents'  = 'ACTIVE_PARENTS'
  'contact'  = 'ACTIVE_CONTACT'
}

foreach ($site in $sites) {
  $pagesDir = "src/$site/pages"
  $partialsDir = "src/$site/partials"
  $outputDir = $site

  if (-not (Test-Path $pagesDir)) {
    Write-Host "Skipping $site (no pages directory)"
    continue
  }

  $header = Read-FileUtf8 "$partialsDir/header.html"
  $footer = Read-FileUtf8 "$partialsDir/footer.html"

  if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force | Out-Null }

  $pageFiles = Get-ChildItem -Path $pagesDir -Filter "*.html"

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
    $slug = if ($pageKey -eq 'index') { $site } else { "$site/$pageKey" }
    $canonicalUrl = "https://ecole-integrale-agadir.pages.dev/$slug"

    $html = $header

    foreach ($kvp in $meta.GetEnumerator()) {
      $html = $html -replace [regex]::Escape("{{$($kvp.Key.ToUpper())}}"), $kvp.Value
    }

    $html = $html -replace [regex]::Escape("{{CANONICAL_URL}}"), $canonicalUrl

    $activeKey = if ($activeMap.ContainsKey($pageKey)) { $activeMap[$pageKey] } else { 'ACTIVE_INDEX' }

    foreach ($key in $activeMap.Values) {
      if ($key -eq $activeKey) {
        $html = $html -replace [regex]::Escape("{{$key}}"), 'active'
      } else {
        $html = $html -replace [regex]::Escape("{{$key}}"), ''
      }
    }

    $html = $html -replace [regex]::Escape("{{OG_TYPE}}"), 'website'

    $html = PrefixLinks "$html`r`n$body`r`n$footer" "/$site"
    $html = AbsAssets $html

    $outPath = Join-Path $outputDir $file.Name
    Write-FileUtf8 $outPath $html
    Write-Host "Built $site/$($file.Name)"
  }
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
