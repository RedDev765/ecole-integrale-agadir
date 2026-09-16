const fs = require('fs');
const path = require('path');

const sites = ['international', 'haut-founty'];

const activeMap = {
  'index': 'ACTIVE_INDEX',
  'about': 'ACTIVE_ABOUT',
  'programs': 'ACTIVE_PROGRAMS',
  'team': 'ACTIVE_TEAM',
  'inscription': 'ACTIVE_INSCRIPTION',
  'contact': 'ACTIVE_CONTACT',
};

// Make relative asset references (/css, /js, /images, /manifest.json) root-absolute
// so generated pages work from any subfolder like /international/ or /haut-founty/.
function absAssets(html) {
  return html.replace(/(href|src)="(css\/|js\/|images\/|downloads\/|manifest\.json)/g, '$1="/$2');
}

// Prefix internal page links (e.g. /about) with the site base (/international/about)
// so navigation stays inside the subsite. Already-prefixed links are left untouched.
const internalTargets = ['/about', '/programs', '/team', '/inscription', '/contact'];
function prefixLinks(html, base) {
  internalTargets.forEach(t => {
    const re = new RegExp('href="' + (t === '' ? '/' : t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) + '"', 'g');
    html = html.replace(re, 'href="' + base + (t === '' ? '/' : t) + '"');
  });
  return html;
}

sites.forEach(site => {
  const pagesDir = path.join('src', site, 'pages');
  const partialsDir = path.join('src', site, 'partials');
  const outputDir = site;

  if (!fs.existsSync(pagesDir)) {
    console.log(`! Skipping ${site} (no pages directory)`);
    return;
  }

  const header = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf-8');
  const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf-8');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

  pageFiles.forEach(file => {
    let raw = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
    raw = raw.replace(/^\uFEFF/, ''); // strip UTF-8 BOM so front-matter parsing works
    const meta = {};
    let body = raw;

    if (raw.startsWith('---')) {
      const end = raw.indexOf('---', 3);
      const front = raw.slice(3, end).trim();
      front.split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx > 0) {
          const key = line.slice(0, idx).trim();
          let val = line.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          meta[key] = val;
        }
      });
      body = raw.slice(end + 3).trim();
    }

    const pageKey = file.replace('.html', '');
    const slug = pageKey === 'index' ? site : `${site}/${pageKey}`;
    const canonicalUrl = `https://ecole-integrale-agadir.pages.dev/${slug}`;

    let html = header.replace('<html lang="fr">', `<html lang="fr" data-site="${site}">`);

    Object.entries(meta).forEach(([k, v]) => {
      html = html.replace(new RegExp(`{{${k.toUpperCase()}}}`, 'g'), v);
    });

    html = html.replace(/{{CANONICAL_URL}}/g, canonicalUrl);

    const activeKey = activeMap[pageKey] || '';

    Object.values(activeMap).forEach(key => {
      html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), key === activeKey ? 'active' : '');
    });

    html = html.replace(/{{OG_TYPE}}/g, meta.ogtype || 'website');

    html = prefixLinks(html + '\n' + body + '\n' + footer, '/' + site);
    // Breadcrumb "Accueil" should point to the subsite home, not the portal root.
    // The portal-return link (class="portal-return") is left untouched.
    html = html.replace(/<a href="\/">Accueil<\/a>/g, `<a href="/${site}/">Accueil</a>`);
    html = absAssets(html);
    // Point the web app manifest to the current subsite so an installed PWA
    // opens the right site instead of the portal root.
    html = html.replace('href="/manifest.json"', `href="/${site}/manifest.json"`);

    fs.writeFileSync(path.join(outputDir, file), html, 'utf-8');
    console.log(`\u2713 Built ${site}/${file}`);
  });

  // Generate a per-site manifest so the PWA opens the correct subsite.
  const rootManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  const siteManifest = {
    ...rootManifest,
    start_url: `/${site}/`,
    scope: `/${site}/`,
    icons: (rootManifest.icons || []).map(icon => ({ ...icon, src: '/images/logo.jpg' })),
  };
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(siteManifest, null, 2), 'utf-8');
  console.log(`\u2713 Built ${site}/manifest.json`);
});

// Copy admin files
const adminSrcDir = 'src/admin';
const adminOutDir = 'admin';

if (fs.existsSync(adminSrcDir)) {
  if (!fs.existsSync(adminOutDir)) {
    fs.mkdirSync(adminOutDir, { recursive: true });
  }
  fs.readdirSync(adminSrcDir).forEach(f => {
    fs.copyFileSync(path.join(adminSrcDir, f), path.join(adminOutDir, f));
    console.log(`\u2713 Copied admin/${f}`);
  });
}

console.log('\u2728 Site build complete');
