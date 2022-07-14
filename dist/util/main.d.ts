export declare let BACKEND: WebSocket;
export declare let isConnected: () => boolean;
export declare const startServer: () => Promise<unknown>;
export declare function getBaseUrl(url: string, prefix?: string): string;
export declare function sleep(ms: number): Promise<unknown>;
