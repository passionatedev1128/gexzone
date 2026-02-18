/**
 * Build: embed CSS and JS into each HTML file for Odoo 19 (self-contained pages).
 * Run: node build-inline.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CSS_PATH = path.join(ROOT, 'css', 'main.css');
const APP_JS_PATH = path.join(ROOT, 'js', 'app.js');
const VOLATILIDAD_JS_PATH = path.join(ROOT, 'js', 'volatilidad.js');

// Pages: [ filePath, { cssHref, appScriptSrc, volatilidad? } ]
const PAGES = [
  { file: 'index.html', css: 'css/main.css', app: 'js/app.js', volatilidad: false },
  { file: 'formacion.html', css: 'css/main.css', app: 'js/app.js', volatilidad: false },
  { file: 'trading-room.html', css: 'css/main.css', app: 'js/app.js', volatilidad: false },
  { file: 'recursos.html', css: 'css/main.css', app: 'js/app.js', volatilidad: false },
  { file: 'volatilidad.html', css: 'css/main.css', app: 'js/app.js', volatilidad: true },
  { file: 'software-bots.html', css: 'css/main.css', app: 'js/app.js', volatilidad: false },
  { file: 'contacto.html', css: 'css/main.css', app: 'js/app.js', volatilidad: false },
  { file: 'legal/cookies.html', css: '../css/main.css', app: '../js/app.js', volatilidad: false },
  { file: 'legal/terminos.html', css: '../css/main.css', app: '../js/app.js', volatilidad: false },
  { file: 'legal/aviso.html', css: '../css/main.css', app: '../js/app.js', volatilidad: false },
];

function escapeScript(js) {
  return js.replace(/<\/script>/gi, '<\\/script>');
}

function main() {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  const appJs = fs.readFileSync(APP_JS_PATH, 'utf8');
  const volatilidadJs = fs.readFileSync(VOLATILIDAD_JS_PATH, 'utf8');

  const styleBlock = '<style>\n/* GEXZONE — main.css (inline for Odoo) */\n' + css + '\n</style>';
  const appScriptBlock = '<script>\n/* GEXZONE — app.js (inline for Odoo) */\n' + escapeScript(appJs) + '\n</script>';
  const volatilidadScriptBlock = '<script>\n/* GEXZONE — volatilidad.js (inline for Odoo) */\n' + escapeScript(volatilidadJs) + '\n</script>';

  for (const page of PAGES) {
    const filePath = path.join(ROOT, page.file);
    if (!fs.existsSync(filePath)) {
      console.warn('Skip (not found):', page.file);
      continue;
    }
    let html = fs.readFileSync(filePath, 'utf8');

    // Replace CSS link (allow optional space before />)
    const cssLinkRe = new RegExp('<link\\s+rel="stylesheet"\\s+href="' + page.css.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"\\s*/?>', 'i');
    html = html.replace(cssLinkRe, styleBlock);

    // Replace app.js script
    const appScriptRe = new RegExp('<script\\s+src="' + page.app.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"\\s*></script>', 'i');
    html = html.replace(appScriptRe, appScriptBlock);

    // Replace volatilidad.js script (volatilidad.html only)
    if (page.volatilidad) {
      const volScriptRe = /<script\s+src="js\/volatilidad\.js"\s*><\/script>/i;
      html = html.replace(volScriptRe, volatilidadScriptBlock);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('OK:', page.file);
  }
  console.log('Done. All HTML files now have inline CSS and JS.');
}

main();
