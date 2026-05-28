
import { createServer } from 'node:http';
import { createApp, toNodeListener, eventHandler, fromNodeMiddleware } from 'h3-v2';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from './dist/server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = createApp();

// Basic static file server logic if serve-static is missing
const serve = (root) => {
  return async (req, res, next) => {
    try {
      const { default: st } = await import('serve-static');
      st(root)(req, res, next);
    } catch (e) {
       next();
    }
  };
};

app.use('/', fromNodeMiddleware(serve(path.join(__dirname, 'dist/client'))));

app.use(eventHandler(async (event) => {
  try {
    // handler.fetch is a standard Web Fetch API handler
    const response = await handler.fetch(event.request);
    return response;
  } catch (err) {
    console.error('Error handling request:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}));

const port = process.env.PORT || 3000;
createServer(toNodeListener(app)).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
