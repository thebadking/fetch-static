import fs from "fs-extra";
import path from "path";
import fetch, { RequestInit } from "node-fetch";

const CACHE_DIR = path.join(process.cwd(), "fetch-static");
const ROUTES_FILE = path.join(process.cwd(), "fetch-static.js");

interface FetchStaticOptions extends RequestInit {
  forceRefresh?: boolean;
}

export async function fetchStatic(
  url: string,
  options: FetchStaticOptions = {}
): Promise<any> {
  if (typeof window !== "undefined") {
    console.warn("fetchStatic can only be executed on the server side.");
    return null;
  }

  const { forceRefresh, ...fetchOptions } = options;
  const urlHash = Buffer.from(url).toString("hex");
  const filePath = path.join(CACHE_DIR, `${urlHash}.json`);

  console.log(`Cache directory: ${CACHE_DIR}`);
  console.log(`Cache file path: ${filePath}`);

  if (
    process.env.NODE_ENV === "production" &&
    !forceRefresh &&
    (await fs.pathExists(filePath))
  ) {
    const cachedData = await fs.readFile(filePath, "utf-8");
    console.log(`Cache hit: ${filePath}`);
    return JSON.parse(cachedData);
  }

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const data = await response.json();

  if (process.env.NODE_ENV !== "production") {
    await fs.ensureDir(CACHE_DIR);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Cached response: ${filePath}`);
  }

  return data;
}

async function loadRoutesFromFile(filePath: string): Promise<string[]> {
  try {
    const configModule = await import(filePath);
    if (configModule) {
      return configModule.default;
    }
    console.error(`No staticPaths found in ${filePath}`);
    return [];
  } catch (error) {
    console.error(`Error loading routes from file:`, error);
    return [];
  }
}
export async function prebuildRoutes() {
  const routes = await loadRoutesFromFile(ROUTES_FILE);

  for (const route of routes) {
    await fetchStatic(route, { forceRefresh: true });
  }
  console.log("Pre-build routes fetching completed.");
}

async function runPrebuild() {
  try {
    await prebuildRoutes();
  } catch (error) {
    console.error("Error during prebuild:", error);
  }
}

runPrebuild();
