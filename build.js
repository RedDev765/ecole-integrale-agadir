const fs = require('fs');
const path = require('path');

const pagesDir = 'src/pages';
const partialsDir = 'src/partials';
const outputDir = '.';

// Build HTML pages
const header = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf-8');
const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf-8');

const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const activeMap = {
  'index': 'ACTIVE_INDEX',
  'about': 'ACTIVE_ABOUT',
  'programs': 'ACTIVE_PROGRAMS',
  'team': 'ACTIVE_TEAM',
  'blog': 'ACTIVE_BLOG',
  'parents': 'ACTIVE_PARENTS',
  'contact': 'ACTIVE_CONTACT',
};

pageFiles.forEach(file => {
  const raw = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
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
  const isIndex = pageKey === 'index';
  const slug = isIndex ? '' : pageKey;
  const canonicalUrl = `https://ecole-integrale-agadir.pages.dev/${slug}`;

  let html = header;

  Object.entries(meta).forEach(([k, v]) => {
    html = html.replace(new RegExp(`{{${k.toUpperCase()}}}`, 'g'), v);
  });

  html = html.replace(/{{CANONICAL_URL}}/g, canonicalUrl);

  const activeKey = activeMap[pageKey] || 'ACTIVE_INDEX';

  Object.values(activeMap).forEach(key => {
    html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), key === activeKey ? 'active' : '');
  });

  html = html.replace(/{{OG_TYPE}}/g, meta.ogtype || 'website');

  html += '\n' + body + '\n' + footer;

  fs.writeFileSync(path.join(outputDir, file), html, 'utf-8');
  console.log(`\u2713 Built ${file}`);
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
