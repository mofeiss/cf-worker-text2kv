import { dispatchToHandler } from '../src/vercel-adapter.js';

export const config = {
  runtime: 'edge',
};

export default async function loginHandler(request) {
  return dispatchToHandler(request, '/api/login');
}
