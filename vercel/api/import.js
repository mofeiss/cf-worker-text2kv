import { dispatchToHandler } from '../src/vercel-adapter.js';

export const config = {
  runtime: 'edge',
};

export default async function importHandler(request) {
  return dispatchToHandler(request, '/api/import');
}
