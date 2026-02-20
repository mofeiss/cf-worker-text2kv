import { dispatchToHandler } from '../../src/vercel-adapter.js';

export const config = {
  runtime: 'edge',
};

export default async function publicFileHandler(request) {
  const url = new URL(request.url);
  let filename = '';

  if (url.pathname.startsWith('/api/f/')) {
    filename = url.pathname.slice('/api/f/'.length);
  } else if (url.pathname.startsWith('/f/')) {
    filename = url.pathname.slice('/f/'.length);
  }

  return dispatchToHandler(request, '/f/' + filename);
}
