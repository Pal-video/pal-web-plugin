import 'jest';
import { PalVideoMiniature, VIDEO_MINIATURE_HTML_ID } from '../../src/sdk/components/miniature/video_miniature';
import { PalSdk, ShowVideoOnlyParams } from '../../src/sdk/palsdk';


describe('Video only', () => {

    let palSdk: PalSdk;

    beforeEach(() => {
        palSdk = new PalSdk();
    });

    test('show a video miniature, click => shows an expanded video', async () => {
        await palSdk.showVideoOnly(<ShowVideoOnlyParams>{
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            minVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            userName: 'John Doe',
            companyTitle: 'John Doe Company',
        });
        let videoMiniature = document.getElementById(VIDEO_MINIATURE_HTML_ID);
        expect(videoMiniature).toBeTruthy();

        videoMiniature!.click();
        expect(document.getElementById(VIDEO_MINIATURE_HTML_ID)).toBeFalsy();
    });


});
