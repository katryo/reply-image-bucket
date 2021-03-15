type Result<T> = T | Error;

export const isError = <T>(result: Result<T>): result is Error => {
  return result instanceof Error;
};

export const isSuccess = <T>(result: Result<T>): result is T => {
  return !isError(result);
};
