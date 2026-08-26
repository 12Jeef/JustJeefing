import { isServerResponse } from "./types.server";

export const time = () => Date.now() / 1e3;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const wait = async (t: number): Promise<void> =>
  await new Promise((res) => setTimeout(res, t * 1e3));

export const checkResponse = async (resp: Response): Promise<any> => {
  if (!resp.ok) {
    const text = await resp.text();
    let responseParsed = false;
    let response: any = null;
    try {
      response = JSON.parse(text);
      responseParsed = true;
    } catch (e) {
      responseParsed = false;
    }
    if (responseParsed)
      if (isServerResponse(response)) {
        if (response.error)
          throw new Error(`${resp.status} ${response.error}: ${response.data}`);
        throw new Error(`${resp.status}: ${response.data}`);
      }
    throw new Error(`${resp.status} ${text}`);
  }
  const text = await resp.text();
  let responseParsed = false;
  let response: any = null;
  try {
    response = JSON.parse(text);
    responseParsed = true;
  } catch (e) {
    responseParsed = false;
  }
  if (!responseParsed) throw new Error(`Bad response JSON: ${text}`);
  if (!isServerResponse(response))
    throw new Error(`Bad response value: ${text}`);
  if (response.error)
    throw new Error(`${resp.status} ${response.error}: ${response.data}`);
  return response.data;
};
