const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('docker compose exposes only nginx on 18080 and wires backend env file', () => {
  const compose = read('docker-compose.yml');

  assert.match(compose, /frontend:/);
  assert.match(compose, /backend:/);
  assert.match(compose, /18080:80/);
  assert.match(compose, /env_file:\s*\r?\n\s*- \.\/backend\/\.env/);
  assert.doesNotMatch(compose, /3001:3001/);
});

test('backend image uses Node 20 Alpine with production install and npm start', () => {
  const dockerfile = read('backend/Dockerfile');

  assert.match(dockerfile, /FROM node:20-alpine/);
  assert.match(dockerfile, /npm ci --omit=dev/);
  assert.match(dockerfile, /EXPOSE 3001/);
  assert.match(dockerfile, /CMD \["npm", "start"\]/);
});

test('frontend image builds with Node 20 Alpine and serves nginx proxy with history fallback', () => {
  const dockerfile = read('frontend/Dockerfile');
  const nginx = read('frontend/nginx.conf');

  assert.match(dockerfile, /FROM node:20-alpine AS build/);
  assert.match(dockerfile, /FROM nginx:alpine/);
  assert.match(nginx, /proxy_pass http:\/\/backend:3001/);
  assert.match(nginx, /location = \/api/);
  assert.match(nginx, /location \/api\//);
  assert.match(nginx, /location = \/health/);
  assert.match(nginx, /try_files \$uri \$uri\/ \/index\.html/);
});

test('docker ignore files keep dependencies, build output, and secrets out of image context', () => {
  const backendIgnore = read('backend/.dockerignore');
  const frontendIgnore = read('frontend/.dockerignore');

  assert.match(backendIgnore, /^node_modules\/?$/m);
  assert.match(backendIgnore, /^\.env$/m);
  assert.match(frontendIgnore, /^node_modules\/?$/m);
  assert.match(frontendIgnore, /^dist\/?$/m);
  assert.match(frontendIgnore, /^\.env$/m);
});
