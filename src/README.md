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
```

#### Usage
##### Create a Configuration File

1. In the root of your project, create a file named fetch-static.js with the following content(example):

```
module.exports = [
  "https://jsonplaceholder.typicode.com/todos/1",
  "https://jsonplaceholder.typicode.com/todos/2"
];
```

Replace the URLs in the array with the endpoints you want to prefetch during the build.

Add Prebuild Script

2. In your project's package.json, add a script to run the prebuild process:

```
"scripts": {
  "prebuild": "fetch-static",
  "build": "npm run prebuild && next build"
}
```

This script will run the prebuild process before building your Next.js application.