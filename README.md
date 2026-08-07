# Onyx Boox Highlight Manager

A local-first highlight manager for Onyx Boox NeoReader and KOReader. Import, organize, review, and export your reading highlights without sending them to a server.

![Desktop](assets/preview.png)

## Try it out

Use the app in your browser: https://booxmanager.netlify.app/

Your highlights are stored locally in your browser using IndexedDB. No account or cloud service is required.

## Features

### 🗄️ Local-first storage

Your highlights stay in your browser. Export them to keep a backup or move them to another device, then import the backup whenever you need it.

### 📥 Import from Onyx Boox or KOReader

This is not limited to Onyx Boox devices. Import highlights from an Onyx Boox export or a KOReader JSON export, then confirm the book details before saving them.

### 📤 Export highlights

Export your highlights to a file for backups, sharing, or transferring your library to another device.

### 📅 Daily review and lists

Revisit highlights with daily review and organize them into custom lists.


## PRs and issues are welcome

Contributions are welcome. Please open an [issue](https://github.com/wjkba/onyx-boox-highlight-manager/issues) to report a bug or suggest an improvement, or submit a [pull request](https://github.com/wjkba/onyx-boox-highlight-manager/pulls) with a proposed change.

## Development

Requires Node.js 22+ and pnpm 11.

```sh
pnpm install
pnpm run dev
pnpm run build
pnpm run lint
```
