// Test production API: login + fetch staff
const https = require('https');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request({ hostname: u.hostname, path: u.pathname, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, path: u.pathname, method: 'GET', headers: { Authorization: 'Bearer ' + token } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, data: d }); } });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  console.log('1. Login...');
  const login = await post('https://sgroup-erp.onrender.com/api/auth/login', { email: 'lisanhung.sgroup@gmail.com', password: '123456' });
  console.log('   Status:', login.status);
  console.log('   Role:', login.data.data?.user?.role, '| SalesRole:', login.data.data?.user?.salesRole);
  
  const token = login.data.data?.access_token;
  if (!token) { console.log('   No token!'); return; }
  console.log('   Token:', token.substring(0, 30) + '...');
  
  console.log('\n2. Fetch staff...');
  const staff = await get('https://sgroup-erp.onrender.com/api/sales-ops/staff', token);
  console.log('   Status:', staff.status);
  if (staff.status === 200 && Array.isArray(staff.data)) {
    console.log('   Staff count:', staff.data.length);
    staff.data.forEach(s => console.log('   ', s.employeeCode, s.fullName, '→', s.team?.name || 'no team'));
  } else {
    console.log('   Response:', JSON.stringify(staff.data).substring(0, 200));
  }
})();
