export async function getGlobalCount() {
  const res = await fetch('http://localhost:5000/api/count');
  return res.json();
}

export async function updateGlobalCount(count) {
  const res = await fetch('http://localhost:5000/api/count', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ count }),
  });
  return res.json();
}
