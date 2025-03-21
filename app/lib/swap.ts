export function swap<T>(array: T[], i: number, j: number): void {
  if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
    return;
  }
  const temp = array[i]!;
  array[i] = array[j]!;
  array[j] = temp;
}
