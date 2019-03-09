export declare const Package: {
    json: (adapter: any, git: string) => string;
    installDependencies: (deps: string[], callback: Function) => void;
    sharedDependencies: any;
    typescriptDependencies: any;
};
