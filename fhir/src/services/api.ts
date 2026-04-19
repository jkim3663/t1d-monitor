const basePath = `${process.env.FHIR_SERVER}/fhir`;

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`FHIR API error ${res.status}: ${text}`);
  }
  return res.json();
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${basePath}/${endpoint}`);
    return handleResponse(res);
  },

  post: async <T>(endpoint: string, body: object): Promise<T> => {
    const res = await fetch(`${basePath}/${endpoint}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async <T>(endpoint: string, body: object): Promise<T> => {
    const res = await fetch(`${basePath}/${endpoint}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${basePath}/${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};