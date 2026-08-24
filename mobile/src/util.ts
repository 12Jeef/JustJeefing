export const time = () => Date.now() / 1e3;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const wait = async (t: number): Promise<void> =>
  await new Promise((res) => setTimeout(res, t * 1e3));
