#!/usr/bin/env node
// Simple test script to verify admin login works

const http = require('http');

async function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function test() {
  try {
    console.log('=== TEST 1: REGISTER ===');
    const register = await makeRequest('POST', '/api/admin/register', 
      JSON.stringify({ username: 'testuser', password: 'password123' }));
    console.log('Status:', register.status);
    console.log('Response:', register.body);
    
    console.log('\n=== TEST 2: LOGIN ===');
    const login = await makeRequest('POST', '/api/admin/login',
      JSON.stringify({ username: 'testuser', password: 'password123' }));
    console.log('Status:', login.status);
    console.log('Response:', login.body);
    
    if (login.body.token) {
      console.log('\n✅ LOGIN SUCCESS - Token received');
      console.log('Response structure: { _id, username, token }');
      console.log('Frontend can parse with: response.data.token');
    } else {
      console.log('\n❌ LOGIN FAILED - No token in response');
    }
  } catch (err) {
    console.error('❌ ERROR:', err.message);
  }
  process.exit(0);
}

// Wait a bit for server to start, then test
setTimeout(test, 2000);
