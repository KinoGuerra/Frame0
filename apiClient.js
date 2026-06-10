const API_BASE_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function apiGet(endpoint) {
  return apiRequest(endpoint);
}

function apiPost(endpoint, body) {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

function apiPut(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

function apiPatch(endpoint) {
  return apiRequest(endpoint, {
    method: "PATCH"
  });
}
