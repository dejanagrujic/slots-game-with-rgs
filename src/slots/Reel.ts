import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';
import { ReelStrip } from '../rgs/types';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const MIN_FULL_SPINS = 2;
const SPIN_DURATION = 120;

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private isSpinning: boolean = false;
    private spinOffset: number = 0;
    private reelStrip: ReelStrip;
    private stopPosition: number;
    private currentPosition: number;
    private symbolsPassed: number = 0;
    private symbolsToStop: number = 0;
    private spinElapsed: number = 0;
    private spinDistance: number = 0;

    constructor(symbolCount: number, symbolSize: number, reelStrip: ReelStrip, stopPosition: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;
        this.reelStrip = reelStrip;
        this.stopPosition = stopPosition;
        this.currentPosition = stopPosition;

        this.createSymbols();

        const mask = new PIXI.Graphics();

        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, this.symbolCount * this.symbolSize, this.symbolSize);
        mask.endFill();

        this.container.addChild(mask);
        this.container.mask = mask;
    }

    private createSymbols(): void {
        // Create symbols for the reel, arranged horizontally
        for (let i = -1; i < this.symbolCount; i++) {
            const symbolIndex = (this.stopPosition + i + this.reelStrip.length) % this.reelStrip.length;
            const symbol = this.createSymbol(this.reelStrip[symbolIndex]);

            symbol.x = i * this.symbolSize;
            symbol.y = 0;

            symbol.width = this.symbolSize;
            symbol.height = this.symbolSize;

            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }
    }

    private createSymbol(symbolId: number): PIXI.Sprite {
        const textureName = SYMBOL_TEXTURES[symbolId - 1];
        const texture = AssetLoader.getTexture(textureName);

        return new PIXI.Sprite(texture);
    }
    
    public update(delta: number): void {
        if (!this.isSpinning) return;

        this.spinElapsed += delta;

        const progress = Math.min(
            this.spinElapsed / SPIN_DURATION,
            1
        );

        //Move symbols horizontally
        const easedProgress = this.easeOut(progress);
        const totalDistance = this.symbolsToStop * this.symbolSize;
        const targetDistance = totalDistance * easedProgress;

        const movement = targetDistance - this.spinDistance;
        this.spinDistance = targetDistance;

        for (const symbol of this.symbols) {
            symbol.x += movement;
        }

        this.spinOffset += movement;

        while (this.spinOffset >= this.symbolSize) {
            this.spinOffset -= this.symbolSize;
            this.rotateSymbols();

            if (!this.isSpinning) {
                break;
            }
        }
    }

    private snapToGrid(): void {
        // Snap symbols to horizontal grid positions  
        this.symbols.sort((a, b) => a.x - b.x);

        this.symbols.forEach((symbol, index) => {
            symbol.x = (index - 1) * this.symbolSize;
        });

        this.spinOffset = 0;
    }

    public setResult(reelStrip: ReelStrip, stopPosition: number): void {
        this.reelStrip = reelStrip;
        this.stopPosition = stopPosition;
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.symbolsPassed = 0;
        this.spinElapsed = 0;
        this.spinDistance = 0;

        const distanceToStop = (this.currentPosition - this.stopPosition + this.reelStrip.length) % this.reelStrip.length;

        this.symbolsToStop = MIN_FULL_SPINS * this.reelStrip.length + distanceToStop;
    }

    private rotateSymbols(): void {
        const lastSymbol = this.symbols.pop();

        if (!lastSymbol) return;

        this.symbols.unshift(lastSymbol);

        lastSymbol.x = this.symbols[1].x - this.symbolSize;

        this.currentPosition = (this.currentPosition - 1 + this.reelStrip.length) % this.reelStrip.length;
        
        this.symbolsPassed++;
        
        const symbolId = this.reelStrip[this.currentPosition];
        lastSymbol.texture = AssetLoader.getTexture(SYMBOL_TEXTURES[symbolId - 1]);

        if (this.symbolsPassed >= this.symbolsToStop) {
            this.isSpinning = false;
            this.snapToGrid();
        }
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }

    private easeOut(progress: number): number {
        return 1 - Math.pow(1 - progress, 3);
    }
}
