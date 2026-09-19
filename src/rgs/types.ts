export type SymbolId = number;
export type ReelStrip = SymbolId[];
export type Reels = ReelStrip[];
export type StopPositions = number[];

export interface RgsResponse {
    reels: Reels;
    stopPositions: StopPositions;
}

export interface SpinRequest {
    bet: number;
}