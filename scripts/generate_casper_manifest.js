const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/casper-template');
const manifestPath = path.join(targetDir, 'manifest.json');

function getFilesRecursively(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, filePath);
      if (
        relativePath !== 'manifest.json' &&
        !relativePath.startsWith('.git') &&
        !relativePath.includes('node_modules')
      ) {
        results.push(relativePath);
      }
    }
  });
  return results;
}

try {
  const files = getFilesRecursively(targetDir);
  fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2), 'utf8');
  console.log(`Successfully generated manifest with ${files.length} files at ${manifestPath}`);
} catch (err) {
  console.error('Failed to generate Casper manifest:', err);
  process.exit(1);
}
