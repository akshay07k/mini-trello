export const BASE_STEP = 1024;

export const nextPosition = (lastPos = 0) => (lastPos ? lastPos + BASE_STEP : BASE_STEP);

export const between = (a, b) => {
  // return midpoint; if equal, fallback to a + tiny step
  if (a == null && b == null) return BASE_STEP;
  if (a == null) return b / 2;
  if (b == null) return a + BASE_STEP;
  const mid = (a + b) / 2;
  return mid === a || mid === b ? a + (BASE_STEP / 2) : mid;
};
