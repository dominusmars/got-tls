export declare let BACKEND: any;
export declare let CONNECTED: boolean;
export declare const startServer: () => Promise<void>;
export declare function getBaseUrl(url: string, prefix?: string): string;
export declare function sleep(ms: number): Promise<unknown>;
