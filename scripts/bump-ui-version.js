/**
 * Bumps UIVersion in environment files (yyyy.M.d.HHmm UTC — mesmo padrão da API).
 * Uso: node scripts/bump-ui-version.js
 * Só altera a linha UIVersion; demais propriedades permanecem intactas.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'src/environments/environment.ts',
  'src/environments/environment.production.ts',
  'src/environments/environment.homologation.ts',
];

const now = new Date();
const version = [
  now.getUTCFullYear(),
  now.getUTCMonth() + 1,
  now.getUTCDate(),
  now.getUTCHours() * 100 + now.getUTCMinutes(),
].join('.');

const uiVersionRegex = /(UIVersion:\s*)(['"])[^'"]*\2/;

for (const rel of files) {
  const filePath = path.join(root, rel);
  const original = fs.readFileSync(filePath, 'utf8');
  if (!uiVersionRegex.test(original)) {
    console.error(`[bump-ui-version] UIVersion não encontrado em ${rel}`);
    process.exit(1);
  }
  const updated = original.replace(uiVersionRegex, `$1$2${version}$2`);
  if (updated === original) {
    console.log(`[bump-ui-version] sem mudança (já ${version}): ${rel}`);
    continue;
  }
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`[bump-ui-version] ${rel} → UIVersion: '${version}'`);
}

console.log(`[bump-ui-version] OK ${version}`);
