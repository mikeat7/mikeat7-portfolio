// Debounce + single-flight for promise functions

export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  wait = 800
) {
  let timer: any = null;
  let pending: Promise<any> | null = null;
  let lastArgs: any[] | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    lastArgs = args;
    if (timer) clearTimeout(timer);

    pending =
      pending ||
      new Promise((resolve, reject) => {
        timer = setTimeout(async () => {
          timer = null;
          const runArgs = lastArgs!;
          lastArgs = null;
          try {
            const res = await fn(...(runArgs as any));
            resolve(res);
          } catch (e) {
            reject(e);
          } finally {
            pending = null;
          }
        }, wait);
      });

    return pending as Promise<any>;
  };
}

export function singleFlight<T extends (...args: any[]) => Promise<any>>(fn: T) {
  let inflight: Promise<any> | null = null;
  return (...args: Parameters<T>) => {
    if (!inflight) {
      inflight = fn(...args).finally(() => {
        inflight = null;
      });
    }
    return inflight as Promise<ReturnType<T>>;
  };
}
