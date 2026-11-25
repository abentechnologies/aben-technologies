const http = require('http');

const PORT = 3000;
const HOST = 'localhost';

const routesToTest = [
  { path: '/', expectedStatus: 200, expectedTitle: 'ABEN TECHNOLOGIES' },
  { path: '/index.html', expectedStatus: 200, expectedTitle: 'ABEN TECHNOLOGIES' },
  { path: '/about', expectedStatus: 200, expectedTitle: 'About Us' },
  { path: '/about.html', expectedStatus: 200, expectedTitle: 'About Us' },
  { path: '/services', expectedStatus: 200, expectedTitle: 'Services' },
  { path: '/services.html', expectedStatus: 200, expectedTitle: 'Services' },
  { path: '/work', expectedStatus: 200, expectedTitle: 'Work' },
  { path: '/work.html', expectedStatus: 200, expectedTitle: 'Work' },
  { path: '/contact', expectedStatus: 200, expectedTitle: 'Contact' },
  { path: '/contact.html', expectedStatus: 200, expectedTitle: 'Contact' },
  { path: '/unknown-route', expectedStatus: 404, expectedTitle: 'Page Not Found' },
  { path: '/google221afec29cd589d7.htm', expectedStatus: 200, exactContent: 'google-site-verification: google221afec29cd589d7.htm' },
  { path: '/api/health', expectedStatus: 200, expectedContent: '"status":"online"' }
];

function checkRoute(route) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: HOST,
      port: PORT,
      path: route.path,
      headers: { 'Accept': 'text/html,application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isRedirect = [301, 302, 307, 308].includes(res.statusCode);
        const titleMatch = data.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : '';

        const statusOk = res.statusCode === route.expectedStatus;
        const titleOk = route.expectedTitle ? title.includes(route.expectedTitle) : true;
        const contentOk = route.expectedContent ? data.includes(route.expectedContent) : true;
        const exactOk = route.exactContent ? data === route.exactContent : true;

        const passed = statusOk && titleOk && contentOk && exactOk && !isRedirect;

        console.log(`[${passed ? 'PASS' : 'FAIL'}] ${route.path.padEnd(30)} -> Status: ${res.statusCode} | Redirect: ${isRedirect ? 'YES' : 'NO'} | Title/Content: "${title || (route.exactContent ? data : (route.expectedContent ? 'JSON OK' : ''))}"`);

        if (passed) {
          resolve();
        } else {
          reject(new Error(`Failed on ${route.path}: status=${res.statusCode}, isRedirect=${isRedirect}, title="${title}"`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log('=======================================================');
  console.log('ABEN Technologies — Automated Route & Redirect Verification');
  console.log('=======================================================');

  // Start server
  const server = require('../server.js');

  // Allow server to bind
  await new Promise(r => setTimeout(r, 1200));

  let allPassed = true;
  for (const route of routesToTest) {
    try {
      await checkRoute(route);
    } catch (err) {
      console.error('  Error:', err.message);
      allPassed = false;
    }
  }

  console.log('=======================================================');
  if (allPassed) {
    console.log('ALL ROUTES PASSED! Zero redirect loops. Every internal page serves correctly.');
    process.exit(0);
  } else {
    console.error('SOME ROUTES FAILED.');
    process.exit(1);
  }
}

run();
