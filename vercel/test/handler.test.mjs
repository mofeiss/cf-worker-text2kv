import test from 'node:test';
import assert from 'node:assert/strict';

import { handleRequest } from '../src/handler.js';

function createMemoryStore() {
  const map = new Map();
  return {
    async get(key) {
      return map.has(key) ? map.get(key) : null;
    },
    async put(key, value) {
      map.set(key, String(value));
    },
    async delete(key) {
      map.delete(key);
    },
  };
}

function createEnv() {
  return {
    adminPassword: 'secret-123',
    store: createMemoryStore(),
  };
}

test('unauthorized api request returns 401', async () => {
  const env = createEnv();
  const response = await handleRequest(new Request('https://example.com/api/files'), env);
  assert.equal(response.status, 401);
});

test('login + create + list + public file works', async () => {
  const env = createEnv();

  const loginResponse = await handleRequest(
    new Request('https://example.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'secret-123' }),
    }),
    env,
  );

  assert.equal(loginResponse.status, 200);
  const cookie = loginResponse.headers.get('set-cookie');
  assert.ok(cookie);

  const createResponse = await handleRequest(
    new Request('https://example.com/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ filename: 'demo.txt', title: 'Demo', content: 'hello vercel' }),
    }),
    env,
  );

  assert.equal(createResponse.status, 201);

  const listResponse = await handleRequest(
    new Request('https://example.com/api/files', { headers: { Cookie: cookie } }),
    env,
  );

  assert.equal(listResponse.status, 200);
  const files = await listResponse.json();
  assert.equal(files.length, 1);
  assert.equal(files[0].filename, 'demo.txt');

  const publicResponse = await handleRequest(new Request('https://example.com/f/demo.txt'), env);
  assert.equal(publicResponse.status, 200);
  const content = await publicResponse.text();
  assert.equal(content, 'hello vercel');
});
