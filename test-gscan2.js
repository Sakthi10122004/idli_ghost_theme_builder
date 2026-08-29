const gscan = require('gscan');

async function test() {
  try {
    const report = await gscan.checkZip('test-theme.zip', { keepExtractedDir: false, checkVersion: 'v5' });
    console.log("Before format score:", report.results.score);
    const formatted = gscan.format(report, { checkVersion: 'v5' });
    console.log("After format score:", report.results.score);
  } catch (e) {
    console.log("e", e)
  }
}
test();
