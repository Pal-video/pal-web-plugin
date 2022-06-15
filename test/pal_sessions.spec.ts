import 'jest';
import { Pal, PalOptions } from '../src';
import { HttpClient } from '../src/api/httpclient';
import { LocalstorageService } from '../src/api/localstorage';
import { PalSession, PlatformTypes } from '../src/api/models/session.model';
import { SessionsApi } from '../src/api/sessions.api';

describe('initialize Pal plugin', () => {



    test('creates a session', async () => {
        const options = <PalOptions>{
            apiKey: '',
            serverUrl: '',
            platform: PlatformTypes.web,
        };
        const httpClient = new HttpClient({ baseUrl: '', apiKey: '' });
        const sessionsApi = new SessionsApi(new LocalstorageService(), httpClient);
        const createSessionSpy = jest.spyOn(sessionsApi, 'createSession');
        jest
            .spyOn(httpClient, 'post')
            .mockResolvedValue(Promise.resolve(<PalSession>{ uid: '8093283093' }));
        // jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
        // jest.spyOn(sessionStorage, 'getItem').mockReturnValue(null);

        // create pal and init session
        const pal = new Pal(sessionsApi, options);
        await pal.initialize();

        // session api has be called and session has been stored
        expect(createSessionSpy).toHaveBeenCalled();
    });
});
