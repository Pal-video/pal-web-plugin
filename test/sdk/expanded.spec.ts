import 'jest';
import { PalVideoExpanded, VIDEO_EXPANDED_HTML_ID, VIDEO_SKIP_BTN_HTML_CLASS } from '../../src/sdk/components/expanded/video_expanded';


describe('Create a video expanded with a correct video url', () => {

    let component: PalVideoExpanded;

    beforeEach(() => {
        component = new PalVideoExpanded(
            'John Doe',
            'John Doe Company',
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            () => { },
            () => { },
            true,
        );
    });

    afterEach(() => {
        if (component.isVisible()) {
            component.removeFromDom();
        }
    });

    test('video is not visible', async () => {
        expect(component.isVisible()).toBe(false);
    });

    test('appendToDom => video is visible', async () => {
        component.appendToDom();
        expect(component.isVisible()).toBe(true);
        expect(document.getElementById(VIDEO_EXPANDED_HTML_ID)).toBeDefined();
    });

    test('video has a skip button => click on skip close the video', async () => {
        component.appendToDom();
        const skipButton = document.getElementsByClassName(VIDEO_SKIP_BTN_HTML_CLASS)[0] as HTMLButtonElement;
        expect(skipButton).toBeDefined();
        skipButton.click();
        expect(component.isVisible()).toBe(false);
    });

});
