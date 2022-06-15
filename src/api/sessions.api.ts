import {HttpClient} from './httpclient';
import {LocalstorageService} from './localstorage';
import {PalSession, PalSessionRequest} from './models/session.model';

export class SessionsApi {
  constructor(
    private localstorageService: LocalstorageService,
    private httpClient: HttpClient
  ) {}

  async createSession(request: PalSessionRequest): Promise<PalSession> {
    const response = await this.httpClient.post<PalSession>('/sessions', {
      frameworkType: request.frameworkType,
      platform: request.platform,
    });
    this.localstorageService.setSession(response);
    return response;
  }

  async getSession(): Promise<PalSession | null> {
    return this.localstorageService.session;
  }

  clearSession() {
    return this.localstorageService.clear();
  }
}
