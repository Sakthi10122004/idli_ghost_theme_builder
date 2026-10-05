const fs = require('fs');
const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/theme/validate',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, '\nResponse:', data));
});

const body = Buffer.concat([
  Buffer.from('------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="theme"; filename="test-theme.zip"\r\nContent-Type: application/zip\r\n\r\n'),
  fs.readFileSync('test-theme.zip'),
  Buffer.from('\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--\r\n')
]);

req.write(body);
req.end();
