import { dispatchToHandler } from '../src/vercel-adapter.js';

export const config = {
  runtime: 'edge',
};

export default async function logoutHandler(request) {
  return dispatchToHandler(request, '/api/logout');
}
