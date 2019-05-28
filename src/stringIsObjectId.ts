function stringIsObjectId(str: string) {
  return /^[0-9a-f]{24}$/.test(str);
}

export default stringIsObjectId;
