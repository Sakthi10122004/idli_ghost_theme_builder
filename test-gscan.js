const gscan = require('gscan');
const fs = require('fs');

async function test() {
  const buffer = fs.readFileSync('test-theme.zip');
  try {
    const report = await gscan.checkZip(buffer, { keepExtractedDir: false, checkVersion: 'latest' });
    console.log("Success", Object.keys(report));
  } catch (e) {
    console.error("Buffer error:", e.message);
  }
}
test();
