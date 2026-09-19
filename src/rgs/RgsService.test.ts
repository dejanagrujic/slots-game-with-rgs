import { RgsService } from './RgsService';

describe('RgsService', () => {
    test('init should return reels and stop positions', () => {
        const rgsService = new RgsService();

        const result = rgsService.init();

        expect(result.reels).toBeDefined();
        expect(result.stopPositions).toBeDefined();
    });

    test('init should return one stop position for each reel', () => {
        const rgsService = new RgsService();

        const result = rgsService.init();

        expect(result.stopPositions.length).toBe(result.reels.length);
    });

    test('init should return valid stop positions', () => {
        const rgsService = new RgsService();

        const result = rgsService.init();

        result.stopPositions.forEach((stopPosition, index) => {
            expect(stopPosition).toBeGreaterThanOrEqual(0);
            expect(stopPosition).toBeLessThan(result.reels[index].length);
        });
    });

    test('spin should return valid stop positions', () => {
        const rgsService = new RgsService();

        const result = rgsService.spin({ bet: 1 });

        result.stopPositions.forEach((stopPosition, index) => {
            expect(stopPosition).toBeGreaterThanOrEqual(0);
            expect(stopPosition).toBeLessThan(result.reels[index].length);
        });
    });

    test('spin should return one stop position for each reel', () => {
        const rgsService = new RgsService();

        const result = rgsService.spin({ bet: 1 });

        expect(result.stopPositions.length).toBe(result.reels.length);
    });

    test.each([0, -1])('spin should reject invalid bet %s', (bet) => {
        const rgsService = new RgsService();

        expect(() => rgsService.spin({ bet }))
            .toThrow('Bet must be greater than zero.');
    });
});