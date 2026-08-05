# Vidrop

Vidrop is a responsive TikTok downloader for public videos. It resolves the
available no-watermark sources on the server, lets the user choose a returned
quality, and downloads the selected MP4 or MP3 from the browser.

Only download content you own or have permission to use. Vidrop does not bypass
private videos, authentication, or access restrictions.

## How it works

```text
React form
  -> POST /api/resolve
  -> server validates the TikTok URL
  -> TikWM resolves public video metadata
  -> server normalizes no-watermark formats
  -> browser fetches the selected media as a Blob
  -> browser saves it with a Vidrop filename
```

The provider response is normalized in `server/tiktok-resolver.ts`. The React
application therefore depends on Vidrop's own response contract, not directly
on provider-specific field names.

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
Functions, while Vite builds the frontend into `dist/`.

## Important limitations

- Only public TikTok links are accepted.
- Available quality depends on the source returned by the resolver.
- TikWM is an external dependency and can change or become unavailable.
- Large media files are temporarily held in browser memory while preparing the
  download.
