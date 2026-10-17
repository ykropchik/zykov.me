// Post-build step:
// 1) generates dist/_headers (security headers for Cloudflare Workers static assets);
// 2) removes the build-only .vite manifests from dist so they are not publicly served.
import { rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

const headers = `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY
`;

await writeFile(`${dist}_headers`, headers);
await rm(`${dist}.vite`, { recursive: true, force: true });

console.log('[postbuild] _headers written, .vite removed');