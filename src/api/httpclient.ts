export class HttpClient {

    private baseUrl: string;

    private apiKey: string;

    constructor({ baseUrl, apiKey }: { baseUrl: string; apiKey: string }) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        console.log("[Pal] configured on client " + this.baseUrl)
    }

    public async get<T>(method: string): Promise<T | null> {
        const _headers = this.headers;
        let options = <RequestInit>{
            method: 'GET',
            headers: _headers,
        };
        const response = await fetch(this.buildUrl(method), options);
        await this.handleError(method, response);

        return response.json();
    }

    public async post<T>(method: string, data: unknown): Promise<T | null> {
        const jsonData = JSON.stringify(data);
        const _headers = this.headers;
        _headers.append('Content-length', jsonData.length.toString());

        let options = <RequestInit>{
            method: 'POST',
            headers: _headers,
            body: jsonData,
        };

        const response = await fetch(this.buildUrl(method), options);
        await this.handleError(method, response);

        return response.json();
    }

    public async put<T>(method: string, data: unknown): Promise<T | null> {
        const jsonData = JSON.stringify(data);
        const _headers = this.headers;
        _headers.append('Content-length', jsonData.length.toString());

        let options = <RequestInit>{
            method: 'PUT',
            headers: _headers,
            body: jsonData,
        };

        const response = await fetch(this.buildUrl(method), options);
        await this.handleError(method, response);

        return response.json();
    }

    //////////////

    private buildUrl(method: string): string {
        return `${this.baseUrl}${method}`;
    }

    private get headers(): Headers {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.apiKey}`);
        headers.append("Content-Type", "application/json");

        return headers;
    }

    private async handleError(method: string, response: Response) {
        await this.handleApiError(method, response);
        if (response && (response.status < 200 || response.status >= 300)) {
            throw new Error(`Pal http call failed 
                -----------------------------------
                url: ${this.baseUrl}${method}
                reason: ${response.status},
                description: ${response.statusText},
                error: ${await response.text()}
                -----------------------------------
            `.replace(/  +/g, ''));
        }
    }

    private async handleApiError(method: string, response: Response) {
        if (response && (response.status < 200 || response.status >= 300)) {
            const errorText = await response.text();
            let error = undefined;
            try {
                error = JSON.parse(errorText);
            } catch(err) {}
            if(error && error.code && error.description) {
                throw new ApiRequestError(
                    `${this.baseUrl}${method}`, 
                    error.code, 
                    response.status,
                    error.description
                );
            }
            
        }
    }
}


export class ApiRequestError extends Error {

    constructor (
        public url: string, 
        public code: string, 
        public status: number,
        public description: string
    ) {
        super(description);    
        this.name = code;
    }
}