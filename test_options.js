const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/cakes/midnight-ganache',
  method: 'OPTIONS',
  headers: {
    'Access-Control-Request-Method': 'PUT',
    'Origin': 'http://localhost:3000'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
