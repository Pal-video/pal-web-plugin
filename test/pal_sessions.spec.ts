import 'jest';
import Pal from '../src';
import {HttpClient} from '../src/api/httpclient';
import {LocalstorageService} from '../src/api/localstorage';
import {PalSession, PlatformTypes} from '../src/api/models/session.model';
import {SessionsApi} from '../src/api/sessions.api';
import {PalOptions} from '../src/options';

describe('initialize Pal with session', () => {
  let pal: Pal;

  let httpClient: HttpClient;

  let sessionsApi: SessionsApi;

  beforeEach(() => {
    const options = <PalOptions>{
      apiKey: '',
      serverUrl: '',
      platform: PlatformTypes.web,
    };
    httpClient = new HttpClient({baseUrl: '', apiKey: ''});
    sessionsApi = new SessionsApi(new LocalstorageService(), httpClient);
    pal = new Pal(sessionsApi, options);
  });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.resetAllMocks();
  });

  test('creates a session', async () => {
    const createSessionSpy = jest.spyOn(sessionsApi, 'createSession');
    jest
      .spyOn(httpClient, 'post')
      .mockResolvedValue(Promise.resolve(<PalSession>{uid: '8093283093'}));

    // init session
    await pal.initialize();

    // session api has be called and session has been stored
    expect(createSessionSpy).toHaveBeenCalled();
    expect(sessionsApi.getSession()).resolves.toEqual(<PalSession>{
      uid: '8093283093',
    });
  });

  test('get a session without initialize should throw', async () => {
    const createSessionSpy = jest.spyOn(sessionsApi, 'createSession');

    expect(createSessionSpy).toBeCalledTimes(0);
    expect(pal.getSession()).rejects.toThrowErrorMatchingSnapshot(
      'Pal has not been initialized'
    );
  });

  test('creates a session, call clear session => get session returns null', async () => {
    const createSessionSpy = jest.spyOn(sessionsApi, 'createSession');
    jest
      .spyOn(httpClient, 'post')
      .mockResolvedValue(Promise.resolve(<PalSession>{uid: '8093283093'}));

    // init session and clear session
    await pal.initialize();
    await pal.clearSession();

    // session api has be called and session has been stored
    expect(sessionsApi.getSession()).resolves.toBeNull();
  });
});
