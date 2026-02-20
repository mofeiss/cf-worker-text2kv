import { handleRequest } from './handler.js';
import { createTursoKVStore } from './turso-store.js';

let store;

function getStore() {
  if (!store) {
    store = createTursoKVStore({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return store;
}

export async function dispatchToHandler(request, pathname) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new Response('Missing ADMIN_PASSWORD', { status: 500 });
  }

  const url = new URL(request.url);
  if (pathname) {
    url.pathname = pathname;
  }

  const normalizedRequest = pathname ? new Request(url.toString(), request) : request;

  try {
    return await handleRequest(normalizedRequest, {
      adminPassword,
      store: getStore(),
    });
  } catch (error) {
    return new Response(error?.message || 'Failed to init store', { status: 500 });
  }
}
