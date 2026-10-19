// Post-build step:
// 1) generates dist/_headers (security headers for Cloudflare Workers static assets,
//    plus long-term caching for /assets/*: Vite puts a content hash in every name there,
//    so a file at a given URL never changes. favicon.ico can't be hashed: browsers ask
//    for /favicon.ico by convention, without any <link>, so it gets a week instead — a replaced icon shows up within that);
// 2) removes the build-only .vite manifests from dist so they are not publicly served.
import { rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

const headers = `
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/favicon.ico
  Cache-Control: public, max-age=604800
`;

await writeFile(`${dist}_headers`, headers);
await rm(`${dist}.vite`, { recursive: true, force: true });

console.log('[postbuild] _headers written, .vite removed');
