const path = require('path');
const fs = require('fs');

module.exports = function(dir, filename, retDir = false) {
  while (dir !== '/') {
    const maybe = path.join(dir, filename);
    if (fs.existsSync(maybe)) return retDir ? dir : maybe;
    dir = path.dirname(dir);
  }
};
