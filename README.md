# Vidrop

Vidrop is a responsive downloader for public TikTok media. It supports videos,
audio, single-photo posts, and photo slideshows through one normalized media
contract.

Only download content you own or have permission to use. Vidrop does not bypass
private posts, authentication, or access restrictions.

## How it works

```text
React form
  -> POST /api/resolve
  -> the TikTok resolver fetches public metadata
  -> the server normalizes the result into Vidrop's media contract
  -> the browser fetches the selected media as a Blob
  -> the browser saves it with a Vidrop filename
```

The shared response contract lives in `server/media-types.ts`, so the React app
does not depend directly on provider-specific fields.

## Run locally

```bash
npm install
npm run dev
```

The Vite development plugin serves `/api/resolve` with the same handler used by
the Vercel Function, so no separate backend process is required.

## Validate

```bash
npm run lint
npm run build
```

## Deploy

Deploy the repository to Vercel. Files inside `api/` are deployed as Vercel
Functions, while Vite builds the frontend into `dist/`. No additional
environment variables are required for the TikTok resolver.

## Important limitations

- Only public TikTok links are accepted.
- Available quality depends on the source returned by the resolver.
- TikWM is an external dependency and can change or become unavailable.
- Large media files are temporarily held in browser memory while preparing the
  download.
