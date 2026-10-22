export function format(templateString: string, ...args: unknown[]): string {
  let result = templateString;
  args.forEach(arg => {
    result = result.replace('%s', String(arg));
  });
  return result;
}
