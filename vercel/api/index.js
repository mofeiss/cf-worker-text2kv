import { dispatchToHandler } from '../src/vercel-adapter.js';

export const config = {
  runtime: 'edge',
};

export default async function rootHandler(request) {
  return dispatchToHandler(request, '/');
}
