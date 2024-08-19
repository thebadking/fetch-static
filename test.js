import fetchStatic from "./dist/fetchStatic.js";
const urlsToFetch = [
  "https://jsonplaceholder.typicode.com/todos/1",
  "https://jsonplaceholder.typicode.com/todos/2",
];

async function fetchData() {
  for (const url of urlsToFetch) {
    try {
      const data = await fetchStatic(url);
      console.log(`Fetched and cached: ${url}`);
      console.log("Data:", data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }
}

fetchData();
