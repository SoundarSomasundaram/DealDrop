import { supabase } from "./utils/supabase/client";

const API_BASE = "/api";

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};
  return {
    "Authorization": `Bearer ${session.access_token}`,
    "Content-Type": "application/json"
  };
}

export async function addProduct(url) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add product");
  return data;
}

export async function getProducts() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/products`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch products");
  return data;
}

export async function deleteProduct(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete product");
  return data;
}

export async function getPriceHistory(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/products/${id}/history`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch price history");
  return data;
}
