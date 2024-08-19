# Fetch Static

[![npm version](https://badge.fury.io/js/fetch-static.svg)](https://badge.fury.io/js/fetch-static) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`fetch-static` is a TypeScript package that wraps around the native `fetch` function. It fetches data during build time, stores the result in the filesystem, and retrieves it from these static files during production. This allows you to avoid unnecessary network requests in production by using cached data, making it ideal for static site generation or build-time data fetching.

**Note:** This package is a workaround for the inability to use `getStaticProps` in the Next.js App Router. It enables similar functionality by handling server-side data fetching and caching.

## Features

- **Server-side only**: Ensures the fetch operations are only executed on the server side.
- **Cache during build time**: Stores fetched data as static files, reducing API calls in production.
- **Customizable options**: Supports the full range of `fetch` options, including HTTP methods, headers, and more.
- **Force refresh**: Optionally bypass the cache and force a fresh fetch even in production.

## Installation

Install via npm:

```bash
npm install fetch-static
