import * as rm from 'typed-rest-client/RestClient';

export class HttpClient {

    private baseUrl: string;

    private apiKey: string;

    private httpClient: rm.RestClient;

    constructor({ baseUrl, apiKey }: { baseUrl: string; apiKey: string }) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.httpClient = new rm.RestClient(
            'pal',
            this.baseUrl,
        );
        let options = {
            maxSockets: 1,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
            }
        };
        this.httpClient.client.requestOptions = options;
    }

    public get<T>(method: string): Promise<T | null> {
        return this.httpClient.get<T>(method).then(res => res.result);
    }

    public post<T>(method: string, data: unknown): Promise<T | null> {
        return this.httpClient
            .create<T>(method, data)
            .then(res => {
                if (res.result && res.statusCode < 200 && res.statusCode >= 300) {
                    throw new Error(`
                        Pal returned an error:
                        url: ${this.baseUrl}${method}
                        reason: ${res.statusCode}
                    `);
                }
                return res.result;
            });
    }

    public put<T>(method: string, data: unknown): Promise<T | null> {
        return this.httpClient
            .update<T>(method, data)
            .then(res => {
                if (res.result && res.statusCode < 200 && res.statusCode >= 300) {
                    throw new Error(`
                        Pal returned an error:
                        url: ${this.baseUrl}${method}
                        reason: ${res.statusCode}
                    `);
                }
                return res.result;
            });

    }
}
