function get(obj: any, path: string) {
  let retval = obj;
  const items = path.split('.');
  for (const item of items) {
    if (typeof retval !== 'object') {
      return undefined;
    }
    if (retval[item] !== undefined) {
      retval = retval[item];
    } else {
      return undefined;
    }
  }
  return retval;
}

export default get;
