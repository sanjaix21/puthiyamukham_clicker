const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://sanjai.lol/puthiyamukham" // production URL
    : "http://localhost:5000";

export async function getGlobalCount() {
  const res = await fetch(`${BASE_URL}/api/count`);
  return res.json();
}

export async function updateGlobalCount(count) {
  const res = await fetch(`${BASE_URL}/api/count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ count }),
  });
  return res.json();
}
