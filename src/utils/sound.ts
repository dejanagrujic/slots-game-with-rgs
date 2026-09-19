import { Howl } from 'howler';
// Implement sound player using the "howler" package
const sounds: Record<string, Howl> = {};
export const sound = {
    add: (alias: string, url: string): void => {
        sounds[alias] = new Howl({
            src: [url]
        });
    },
    play: (alias: string): void => {
        const soundToPlay = sounds[alias];

        if (soundToPlay) {
            soundToPlay.play();
        }
    },
    stop: (alias: string): void => {
        const soundToStop = sounds[alias];

        if (soundToStop) {
            soundToStop.stop();
        }
    }
};
