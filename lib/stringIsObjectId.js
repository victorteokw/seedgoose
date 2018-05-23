module.exports = function(str) {
  return /^[0-9a-f]{24}$/.test(str);
};
