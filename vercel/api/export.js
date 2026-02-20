import { dispatchToHandler } from '../src/vercel-adapter.js';

export const config = {
  runtime: 'edge',
};

export default async function exportHandler(request) {
  return dispatchToHandler(request, '/api/export');
}
