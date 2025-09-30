export async function runCourtSearch(payload: any) {
  const res = await fetch("/api/court/search", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Search failed");
  return json;
}





