import 'jest';
import { Pal } from '../src';
import { PalEventApi } from '../src/api/event.api';
import { HttpClient } from '../src/api/httpclient';
import { LocalstorageService } from '../src/api/localstorage';
import { PalSession, PlatformTypes } from '../src/api/models/session.model';
import { PalVideoTrigger } from '../src/api/models/video_trigger.model';
import { SessionsApi } from '../src/api/sessions.api';
import { PalOptions } from '../src/options';
import { PalSdk } from '../src/sdk/palsdk';

describe('pal is initialized with a session, call logCurrentScreen', () => {
    let pal: Pal;

    let httpClient: HttpClient;

    let sessionsApi: SessionsApi;


    beforeEach(async () => {
        const options = <PalOptions>{
            apiKey: '',
            serverUrl: '',
            platform: PlatformTypes.web,
        };
        httpClient = new HttpClient({ baseUrl: '', apiKey: '' });
        sessionsApi = new SessionsApi(new LocalstorageService(), httpClient);
        const eventsApi = new PalEventApi(httpClient);
        pal = new Pal(sessionsApi, eventsApi, options, new PalSdk());
        jest
            .spyOn(httpClient, 'post')
            .mockResolvedValue(Promise.resolve(<PalSession>{ uid: '8093283093' }));
        // init session and reset mocks
        await pal.initialize();
        jest.resetAllMocks();
    });

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        jest.resetAllMocks();
    });

    test('A screen name is provided, server returns a video => pal sdk shows a video miniature', async () => {
        await pal.initialize();
        // const logCurrentVideoSpy = jest.spyOn(eventApi, 'logEvent');
        jest
            .spyOn(httpClient, 'post')
            .mockResolvedValue(Promise.resolve(<PalVideoTrigger>{
                eventLogId: '8093283093',
                videoId: '802380392AAVIDEO',
                creationDate: new Date(2022, 10, 1),
                videoUrl: 'https://myvideo.mp4',
                videoThumbUrl: 'https://myvideothumb.mp4',
                imgThumbUrl: 'https://myimage.jpg',
                videoSpeakerName: 'Gautier',
                videoSpeakerRole: 'CTO',
            }));

        await pal.logCurrentScreen("my screen");
        // expect(logCurrentVideoSpy).toHaveBeenCalled();
    });
});
