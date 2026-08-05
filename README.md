# Vidrop

Vidrop is a responsive downloader for public TikTok and Instagram media. It
supports videos, audio, photos, TikTok slideshows, and Instagram carousels
through one normalized media contract.

Only download content you own or have permission to use. Vidrop does not bypass
private videos, authentication, or access restrictions.

## How it works

```text
React form
  -> POST /api/resolve
  -> server detects the platform from the URL
  -> the matching TikTok or Instagram resolver fetches metadata
  -> server normalizes the result into Vidrop's media contract
  -> browser fetches the selected media as a Blob
  -> browser saves it with a Vidrop filename
```

Platform routing lives in `server/media-resolver.ts`. Each provider response is
normalized into the contract in `server/media-types.ts`, so the React app does
not depend directly on provider-specific fields.

## Heavy media resolver

Vercel validates requests and resolves TikTok directly. Instagram public
metadata is read directly first, with a self-hosted Cobalt service available as
a fallback when Instagram blocks server-side metadata requests.

```env
MEDIA_RESOLVER_URL=https://your-cobalt-instance.example/
MEDIA_RESOLVER_API_KEY=your-api-key-if-required
```

Add the same variables to the Vercel project. The older `COBALT_API_URL` and
`COBALT_API_KEY` names remain supported for compatibility. Do not use the
hosted `api.cobalt.tools` instance without explicit permission from its owner.

Recommended deployment split:

```text
Browser
  -> Vercel: Vidrop frontend + /api/resolve
      -> TikWM: TikTok public metadata
      -> Instagram: direct public metadata when available
      -> Cobalt service: optional Instagram fallback
```

Run Cobalt on a Docker-capable host using its official self-hosting guide,
protect the instance with an API key, then configure the two variables above.

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

- Only public TikTok and Instagram post links are accepted.
- Available quality depends on the source returned by the resolver.
- TikWM is an external dependency and can change or become unavailable.
- Instagram reliability depends on direct public metadata or the configured
  Cobalt instance.
- Large media files are temporarily held in browser memory while preparing the
  download.
