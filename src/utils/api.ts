export const API = (
  api: string,
  endpoint: string,
  method: string,
  accessToken?: string,
  body: any = null
): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const sendObj: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      if (accessToken) {
        (sendObj.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
      }

      if (body) {
        sendObj.body = JSON.stringify(body);
      }

      const res = await fetch(`${api}${endpoint}`, sendObj);
      const data = await res.json();
      if (!res.ok) {
        reject(data);
        return;
      }
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

export const API_FILE = (
  api: string,
  endpoint: string,
  method: string,
  accessToken: string | undefined,
  form: FormData
): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const sendObj: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json'
        },
        body: form
      };

      if (accessToken) {
        (sendObj.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${api}${endpoint}`, sendObj);
      const data = await res.json();
      if (!res.ok) {
        reject(data);
        return;
      }
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
