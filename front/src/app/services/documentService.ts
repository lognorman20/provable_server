const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const fetchDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`);
  if (!response.ok) throw new Error("Failed to fetch documents");
  return response.json();
};

export const saveDocument = async (id, data) => {
  const url = id ? `${API_BASE_URL}/update/${id}` : `${API_BASE_URL}/submit`;
  const method = id ? "PUT" : "POST";
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to save document: ${response.statusText}`);
  return response;
};

export const deleteDocument = async (id) => {
  const response = await fetch(`${API_BASE_URL}/delete/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete document: ${response.statusText}`);
  return response;
};

export const fetchDocumentDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch document details: ${response.statusText}`);
  return response.json();
};