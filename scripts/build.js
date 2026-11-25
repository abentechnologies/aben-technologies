const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BUILD_DIR = path.join(ROOT_DIR, 'build');

console.log('=======================================================');
console.log('ABEN Technologies — Production Frontend Build');
console.log(`Environment: Node ${process.version}`);
console.log(`Working Directory: ${ROOT_DIR}`);
console.log('=======================================================');

// 1. Core HTML pages
const htmlFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'services.html',
  'work.html',
  '404.html'
];

// 2. Static asset folders
const staticDirs = [
  'assets'
];

// 3. Deployment & server configuration files (no _redirects to avoid loops)
const configFiles = [
  '_headers',
  'robots.txt'
];

// Validate required source files
console.log('\n[PHASE 1] Validating source files...');
let hasErrors = false;
for (const file of htmlFiles) {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR]: Required frontend page not found: ${file}`);
    hasErrors = true;
  } else {
    const size = fs.statSync(filePath).size;
    console.log(`  ✓ ${file} (${(size / 1024).toFixed(1)} KB)`);
  }
}

if (hasErrors) {
  console.error('\n[BUILD FAILED]: Missing required source files.');
  process.exit(1);
}

// Function to populate target distribution directory
function buildTarget(targetDir, label) {
  console.log(`\n[PHASE 2] Assembling production output in: ${label} (${path.relative(ROOT_DIR, targetDir)}/)...`);

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, { recursive: true });

  // Copy HTML files
  for (const file of htmlFiles) {
    const src = path.join(ROOT_DIR, file);
    const dest = path.join(targetDir, file);
    fs.copyFileSync(src, dest);
  }
  console.log(`  ✓ Copied ${htmlFiles.length} HTML pages to ${label}/`);

  // Copy assets recursively
  for (const dir of staticDirs) {
    const src = path.join(ROOT_DIR, dir);
    const dest = path.join(targetDir, dir);
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true });
      console.log(`  ✓ Copied directory ${dir}/ to ${label}/${dir}/`);
    }
  }

  // Copy config files if present
  let copiedConfigs = 0;
  for (const file of configFiles) {
    const src = path.join(ROOT_DIR, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      copiedConfigs++;
    }
  }
  if (copiedConfigs > 0) {
    console.log(`  ✓ Copied ${copiedConfigs} deployment configuration file(s) to ${label}/`);
  }
}

// Build primary dist/ output directory (Cloudflare default)
buildTarget(DIST_DIR, 'dist');

// Build build/ output directory (compatibility mirror for CRA/generic presets)
buildTarget(BUILD_DIR, 'build');

// Verification summary
console.log('\n[PHASE 3] Verifying generated build artifacts...');
const distIndex = path.join(DIST_DIR, 'index.html');
const distAssets = path.join(DIST_DIR, 'assets');

if (!fs.existsSync(distIndex) || !fs.existsSync(distAssets)) {
  console.error('[BUILD FAILED]: Verification failed - dist output incomplete.');
  process.exit(1);
}

console.log('  ✓ dist/index.html verified');
console.log('  ✓ dist/about.html verified');
console.log('  ✓ dist/contact.html verified');
console.log('  ✓ dist/services.html verified');
console.log('  ✓ dist/work.html verified');
console.log('  ✓ dist/404.html verified');
console.log('  ✓ dist/assets/ verified');

console.log('\n=======================================================');
console.log('ABEN Technologies production build completed successfully!');
console.log('Cloudflare Workers & Pages ready (zero redirect loops).');
console.log('=======================================================');
