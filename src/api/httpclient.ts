// import {Axios} from 'axios';

export class HttpClient {
  //   private axios: Axios;

  constructor({baseUrl, apiKey}: {baseUrl: string; apiKey: string}) {
    // this.axios = new Axios({
    //   baseURL: baseUrl,
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    // });
  }

  public get<T>(method: string): Promise<T> {
    throw new Error('Method not implemented.');
    // return this.axios.get(method);
  }

  public post<T>(method: string, data: unknown): Promise<T> {
    throw new Error('Method not implemented.');
    // return this.axios.post(method, data);
  }

  public put<T>(method: string, data: unknown): Promise<T> {
    throw new Error('Method not implemented.');
    // return this.axios.post(method, data);
  }
}
