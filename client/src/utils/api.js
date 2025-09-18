const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://sanjai.lol/puthiyamukham/api" // production URL
    : "http://localhost:5000/puthiyamukham/api";

export async function getGlobalCount() {
  const res = await fetch(`${BASE_URL}/count`);
  return res.json();
}

export async function updateGlobalCount(count) {
  const res = await fetch(`${BASE_URL}/count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ count }),
  });
  return res.json();
}
