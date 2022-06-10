export function objectFromKeys<
  Arr extends ReadonlyArray<string | symbol | number>,
  T
>(arr: Arr, initializer: T): Record<Arr[number], T> {
  return arr.reduce((prev, key) => {
    (prev as any)[key] = initializer;
    return prev;
  }, {} as Record<Arr[number], T>);
}
