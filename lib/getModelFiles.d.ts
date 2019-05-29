declare type ModelMatcher = string | RegExp | Array<string | RegExp>;
declare function getModelFiles(projRoot: string, modelMatcher: ModelMatcher, modelBaseDir: string): string[];
export default getModelFiles;
