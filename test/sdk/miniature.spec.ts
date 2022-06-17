import 'jest';
import { PalVideoMiniature, VIDEO_MINIATURE_HTML_ID } from '../../src/sdk/components/miniature/video_miniature';


describe('Create a video miniature with a correct video url', () => {

    let videoMiniature: PalVideoMiniature;

    beforeEach(() => {
        videoMiniature = new PalVideoMiniature(
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            150,
            () => { },
        );
    });

    test('video is not visible', async () => {
        expect(videoMiniature.isVisible()).toBe(false);
    });

    test('call appendToDom => shows a video', async () => {
        videoMiniature.appendToDom();
        expect(videoMiniature.isVisible()).toBe(true);
    });

    test('call removeFromDom => removes the video', async () => {
        videoMiniature.removeFromDom();
        expect(videoMiniature.isVisible()).toBe(false);
    });

});
