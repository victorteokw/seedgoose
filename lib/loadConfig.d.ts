declare function loadConfig(projRoot: string, argv: string[]): [string, string[], {
    [key: string]: any;
}];
export default loadConfig;
