export function handleUnknownError(e) {
  if (e instanceof Error) {
    return e;
  }
  if (e && typeof e === 'object' && 'toString' in e) {
    return new Error(e.toString());
  }
  if (typeof e === 'string') {
    return new Error(e);
  }
  return new Error('Unknown error has occured.');
}
