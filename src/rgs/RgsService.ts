import { Reels, RgsResponse, SpinRequest, StopPositions } from './types';

const REELS: Reels = [
    [1, 2, 3, 4, 5, 1, 3, 5, 2, 4],
    [2, 3, 4, 5, 1, 2, 4, 1, 5, 3],
    [3, 4, 5, 1, 2, 3, 5, 2, 1, 4],
    [4, 5, 1, 2, 3, 4, 1, 3, 2, 5],
];
const INITIAL_STOP_POSITIONS: StopPositions = [0, 1, 2, 3];

export class RgsService {
    public init(): RgsResponse {
        return {
            reels: REELS,
            stopPositions: INITIAL_STOP_POSITIONS,
        };
    }

    public spin(request: SpinRequest): RgsResponse {
        if (request.bet <= 0){
            throw new Error('Bet must be greater than zero.');
        }

        const stopPositions: StopPositions = REELS.map(
            reel => Math.floor(Math.random() * reel.length)
        );

        return {
            reels: REELS,
            stopPositions,
        };
    }
}