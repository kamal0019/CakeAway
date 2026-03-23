const http = require('http');

const data = JSON.stringify({
  name: "Midnight Ganache Updated",
  price: 1599,
  description: "Updated description",
  flavour: "Dark Chocolate",
  type: "Chocolate",
  image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/cakes/midnight-ganache',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer test-token' // This will fail verifyToken but let's see response
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
