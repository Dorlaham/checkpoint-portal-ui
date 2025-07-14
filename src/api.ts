// src/api.ts
export const API_URL = "https://dorlaham-secure.com/api";

interface BlockedTypesPayload {
  blocked_extensions: string[];
  blocked_mime_types: string[];
}

type LogResponse = {
  logs: any[];
  nextCursor: string | null;
  has_next: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(!isFormData && options.body ? { 'Content-Type': 'application/json' } : {}),
  ...(options.headers ? options.headers as Record<string, string> : {}),
};


  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchLogs(token: string, cursor?: string): Promise<LogResponse> {  
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return await apiFetch<LogResponse>(`/logs/${query}`, {}, token);
}

export async function getBlockedTypes(token: string) {
  return apiFetch<BlockedTypesPayload>('/config/blocked-types', {}, token);
}

export async function updateBlockedTypes(
  token: string,
  data: BlockedTypesPayload
) {
  return apiFetch(
    '/config/blocked-types',
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  );
}

