import fs from "fs-extra";
import path from "path";
import fetch, { RequestInit } from "node-fetch";

const CACHE_DIR = path.join(process.cwd(), "fetch-static");

interface FetchStaticOptions extends RequestInit {
  forceRefresh?: boolean;
}

async function fetchStatic(
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

  if (
    process.env.NODE_ENV === "production" &&
    !forceRefresh &&
    (await fs.pathExists(filePath))
  ) {
    const cachedData = await fs.readFile(filePath, "utf-8");
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
  }

  return data;
}

export default fetchStatic;
