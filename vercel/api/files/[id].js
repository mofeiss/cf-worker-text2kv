import { dispatchToHandler } from '../../src/vercel-adapter.js';

export const config = {
  runtime: 'edge',
};

export default async function fileByIdHandler(request) {
  const url = new URL(request.url);
  const id = url.pathname.slice('/api/files/'.length);
  return dispatchToHandler(request, '/api/files/' + id);
}
