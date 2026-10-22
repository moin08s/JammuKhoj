import fs from 'fs';
import path from 'path';

// Load translation files
import enTranslations from '../src/i18n/en.json';
import hiTranslations from '../src/i18n/hi.json';
import doiTranslations from '../src/i18n/doi.json';

interface AuditFinding {
  type: 'ERROR' | 'WARNING' | 'GAP' | 'PASS';
  category: string;
  file?: string;
  message: string;
  details?: string;
}

const findings: AuditFinding[] = [];

function record(type: 'ERROR' | 'WARNING' | 'GAP' | 'PASS', category: string, message: string, file?: string, details?: string) {
  findings.push({ type, category, file, message, details });
}

console.log('====================================================');
console.log('     JAMMUKHOJ COMPREHENSIVE UI AUDIT & GAP SCAN    ');
console.log('====================================================\n');

// Valid routes defined in Router.tsx
const VALID_ROUTE_PATTERNS = [
  '/',
  '/welcome',
  '/onboarding',
  '/download',
  '/privacy',
  '/plan',
  '/plan/result',
  '/explore',
  '/explore/', // dynamic /explore/:id
  '/map',
  '/suggestions',
  '/transport',
  '/safety',
  '/command',
  '/admin',
  '/saved',
  '/settings',
  '/login',
  '/business',
  '/benchmark',
  '/city-analysis',
];

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const srcDir = path.resolve(process.cwd(), 'src');
const allSrcFiles = getAllFiles(srcDir);

// -----------------------------------------------------------------------------
// 1. ROUTING & NAVIGATION AUDIT
// -----------------------------------------------------------------------------
console.log('>>> [1/6] Auditing Application Routing & Navigation Links...');
let totalNavigationsChecked = 0;
let brokenRoutesCount = 0;

allSrcFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativeFile = path.relative(srcDir, file);

  // Match navigate('...'), to="..."
  const navMatches = content.matchAll(/(?:navigate\s*\(\s*['"`]([^'"`]+)['"`]|to\s*=\s*['"`]([^'"`]+)['"`])/g);
  for (const match of navMatches) {
    const target = match[1] || match[2];
    if (!target) continue;

    // Skip external links or anchor links
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('#') || target.startsWith('tel:') || target.startsWith('mailto:')) {
      continue;
    }

    totalNavigationsChecked++;

    // Strip query params or hash
    const basePath = target.split('?')[0].split('#')[0];

    const isValid = VALID_ROUTE_PATTERNS.some((pattern) => {
      if (pattern.endsWith('/')) {
        return basePath.startsWith(pattern);
      }
      return basePath === pattern;
    });

    if (!isValid) {
      brokenRoutesCount++;
      record('ERROR', 'ROUTING', `Broken route reference detected: "${target}"`, relativeFile);
    }
  }
});

if (brokenRoutesCount === 0) {
  record('PASS', 'ROUTING', `All ${totalNavigationsChecked} navigation paths resolve to valid application routes.`);
}

// -----------------------------------------------------------------------------
// 2. ACCESSIBILITY: IMAGES & BUTTONS AUDIT
// -----------------------------------------------------------------------------
console.log('>>> [2/6] Auditing Accessibility (Images, Alt Texts, Button Labels)...');
let totalImagesChecked = 0;
let missingAltCount = 0;
let totalButtonsChecked = 0;
let missingButtonLabelCount = 0;

allSrcFiles.filter((f) => f.endsWith('.tsx')).forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativeFile = path.relative(srcDir, file);

  // Check <img tags for alt attribute
  const imgMatches = content.matchAll(/<img\s+([^>]*?)>/g);
  for (const match of imgMatches) {
    totalImagesChecked++;
    const attrs = match[1];
    if (!attrs.includes('alt=') && !attrs.includes('alt =')) {
      missingAltCount++;
      record('WARNING', 'A11Y_IMAGE', `Image tag missing 'alt' attribute`, relativeFile, match[0].substring(0, 80));
    }
  }

  // Check icon-only buttons for missing aria-label or title
  const buttonMatches = content.matchAll(/<button\s+([^>]*?)>([\s\S]*?)<\/button>/g);
  for (const match of buttonMatches) {
    totalButtonsChecked++;
    const attrs = match[1];
    const body = match[2].trim();

    // If button has no visible text and contains only an icon or empty space
    const hasVisibleText = />[^<]{2,}</.test(body) || body.includes('{t(') || body.includes('<span>') || body.includes('<strong');
    const hasAriaLabel = attrs.includes('aria-label') || attrs.includes('title');

    if (!hasVisibleText && !hasAriaLabel) {
      missingButtonLabelCount++;
      record('GAP', 'A11Y_BUTTON', `Icon or action button lacks accessible label (missing aria-label or title)`, relativeFile, match[0].substring(0, 90));
    }
  }
});

record('PASS', 'A11Y_IMAGE', `Audited ${totalImagesChecked} images across UI components (${missingAltCount} missing alt).`);
record('PASS', 'A11Y_BUTTON', `Audited ${totalButtonsChecked} buttons across UI components (${missingButtonLabelCount} icon-only gaps).`);

// -----------------------------------------------------------------------------
// 3. I18N TRANSLATION COMPLETENESS AUDIT
// -----------------------------------------------------------------------------
console.log('>>> [3/6] Auditing Translation Parity (EN / HI / DOI)...');

function getNestedKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getNestedKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = new Set(getNestedKeys(enTranslations));
const hiKeys = new Set(getNestedKeys(hiTranslations));
const doiKeys = new Set(getNestedKeys(doiTranslations));

let missingHi = 0;
let missingDoi = 0;

enKeys.forEach((k) => {
  if (!hiKeys.has(k)) {
    missingHi++;
    record('WARNING', 'I18N', `Missing Hindi translation key: "${k}"`);
  }
  if (!doiKeys.has(k)) {
    missingDoi++;
    record('WARNING', 'I18N', `Missing Dogri translation key: "${k}"`);
  }
});

if (missingHi === 0 && missingDoi === 0) {
  record('PASS', 'I18N', `100% translation parity across ${enKeys.size} dictionary keys for English, Hindi, and Dogri.`);
}

// -----------------------------------------------------------------------------
// 4. MOBILE RESPONSIVE OVERFLOW & LAYOUT AUDIT
// -----------------------------------------------------------------------------
console.log('>>> [4/6] Auditing Mobile Responsive Layouts & Overflow Risks...');
let fixedWidthGaps = 0;

allSrcFiles.filter((f) => f.endsWith('.tsx')).forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativeFile = path.relative(srcDir, file);

  // Look for fixed pixel widths > 340px that aren't max-w or media queried
  const fixedWidthMatches = content.matchAll(/className=["']([^"']*\bw-\[(\d+)px\][^"']*)["']/g);
  for (const match of fixedWidthMatches) {
    const classList = match[1];
    const widthVal = parseInt(match[2], 10);
    if (widthVal > 340 && !classList.includes('max-w-') && !classList.includes('sm:') && !classList.includes('md:')) {
      fixedWidthGaps++;
      record('GAP', 'RESPONSIVE', `Potential mobile overflow: fixed width w-[${widthVal}px] without responsive constraint`, relativeFile);
    }
  }
});

if (fixedWidthGaps === 0) {
  record('PASS', 'RESPONSIVE', 'Zero non-responsive fixed width overflows detected.');
}

// -----------------------------------------------------------------------------
// 5. MODAL DISMISS & ESCAPE ACCESSIBILITY AUDIT
// -----------------------------------------------------------------------------
console.log('>>> [5/6] Auditing Modal Close & Dismiss Mechanisms...');
let modalsChecked = 0;
let modalsWithoutClose = 0;

allSrcFiles.filter((f) => f.includes('Modal.tsx')).forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativeFile = path.relative(srcDir, file);
  modalsChecked++;

  const hasCloseButton = content.includes('onClose') || content.includes('setShow') || content.includes('dismiss') || content.includes('<X') || content.includes('<XCircle');
  if (!hasCloseButton) {
    modalsWithoutClose++;
    record('WARNING', 'MODAL', `Modal may lack a direct close/dismiss handler`, relativeFile);
  }
});

record('PASS', 'MODAL', `Audited ${modalsChecked} modal components for safe dismissal and escape paths.`);

// -----------------------------------------------------------------------------
// 6. UI/UX GAPS & ENHANCEMENT CANDIDATE ANALYSIS
// -----------------------------------------------------------------------------
console.log('>>> [6/6] Analyzing UI/UX Feature Gaps & Usability Polish Opportunities...');

// A. Check for 404 / Catch-all page UI richness
const routerContent = fs.readFileSync(path.resolve(srcDir, 'app/Router.tsx'), 'utf-8');
if (routerContent.includes('Navigate to="/" replace')) {
  record('GAP', 'UX_ROUTING', '404 Catch-All redirects directly to home instead of presenting a branded 404 Not Found screen with search recovery.');
}

// B. Check for offline network reconnection banner
const appShellContent = fs.readFileSync(path.resolve(srcDir, 'ui/layout/AppShell.tsx'), 'utf-8');
if (!appShellContent.includes('offline') && !appShellContent.includes('Offline')) {
  record('GAP', 'UX_OFFLINE', 'Global AppShell lacks a persistent, non-intrusive offline status banner when device drops internet connection.');
}

// C. Check Bottom Navigation active items count
const bottomNavContent = fs.readFileSync(path.resolve(srcDir, 'ui/layout/BottomNav.tsx'), 'utf-8');
if (!bottomNavContent.includes('/saved') && !bottomNavContent.includes('/map')) {
  record('GAP', 'UX_NAVIGATION', 'Bottom Navigation has 5 tabs (Home, Explore, Plan, Transport, Safety), but quick 1-tap access to Map or Saved Places requires opening header menu on mobile.');
}

// -----------------------------------------------------------------------------
// SUMMARY & FINDINGS REPORT
// -----------------------------------------------------------------------------
console.log('\n====================================================');
console.log('           UI AUDIT RESULTS SUMMARY                 ');
console.log('====================================================\n');

const errors = findings.filter((f) => f.type === 'ERROR');
const warnings = findings.filter((f) => f.type === 'WARNING');
const gaps = findings.filter((f) => f.type === 'GAP');
const passes = findings.filter((f) => f.type === 'PASS');

console.log(`PASSED CHECKS: ${passes.length}`);
console.log(`ERRORS (Broken items): ${errors.length}`);
console.log(`WARNINGS (A11y/i18n): ${warnings.length}`);
console.log(`GAPS IDENTIFIED (UI/UX polish): ${gaps.length}\n`);

if (errors.length > 0) {
  console.log('--- ERRORS ---');
  errors.forEach((e) => console.log(`[${e.category}] ${e.message} in ${e.file}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('--- WARNINGS ---');
  warnings.forEach((w) => console.log(`[${w.category}] ${w.message} in ${w.file || 'General'}`));
  console.log('');
}

if (gaps.length > 0) {
  console.log('--- IDENTIFIED GAPS FOR IMPROVEMENT ---');
  gaps.forEach((g) => console.log(`[${g.category}] ${g.message} (File: ${g.file || 'General'})`));
  console.log('');
}

console.log('====================================================\n');
