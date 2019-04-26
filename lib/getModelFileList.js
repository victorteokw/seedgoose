const path = require('path');
const walkSync = require('walk-sync');

const resolveModelFiles = (modelMatcher, modelDir) => {
  if (Array.isArray(modelMatcher)) {
    const result = [];
    for (const matcher of modelMatcher) {
      result.splice(result.length, 0, ...resolveModelFiles(matcher, modelDir));
    }
    return result;
  } else if (modelMatcher.constructor === RegExp) {
    const files = walkSync(modelDir, { directories: false });
    return files.filter((f) => modelMatcher.test(f)).map((f) => {
      return path.join(modelDir, f);
    });
  } else if (typeof modelMatcher === 'string') {
    return walkSync(modelDir, { globs: [modelMatcher] }).map((f) => {
      return path.join(modelDir, f);
    });
  }
};

module.exports = (projRoot, modelMatcher, modelBaseDir) => {
  if (!modelMatcher) {
    throw new Error('Model matcher required.');
  }
  const modelDir = path.join(projRoot, modelBaseDir);
  const modelFiles = resolveModelFiles(modelMatcher, modelDir);
  if (modelFiles.length === 0) {
    throw new Error('No model files found.');
  }
  return modelFiles;
};
