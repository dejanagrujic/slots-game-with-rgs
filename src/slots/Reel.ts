import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down
const MIN_STOP_SPEED = 5;

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;
    private spinOffset: number = 0;
    private isAligning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

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
            const symbol = this.createRandomSymbol();

            symbol.x = i * this.symbolSize;
            symbol.y = 0;

            symbol.width = this.symbolSize;
            symbol.height = this.symbolSize;

            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }
    }

    private createRandomSymbol(): PIXI.Sprite {
        // TODO:Get a random symbol texture
        const randomIndex = Math.floor(Math.random() * SYMBOL_TEXTURES.length);
        const textureName = SYMBOL_TEXTURES[randomIndex];

        // TODO:Create a sprite with the texture
        const texture = AssetLoader.getTexture(textureName);
        const sprite = new PIXI.Sprite(texture);

        return sprite;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        // TODO:Move symbols horizontally
        let movement = this.speed * delta;
        if (this.isAligning) {
            const distanceToGrid = this.symbolSize - this.spinOffset;
            movement = Math.min(movement, distanceToGrid);
        }

        for (const symbol of this.symbols) {
            symbol.x += movement;
        }

        this.spinOffset += movement;

        while (this.spinOffset >= this.symbolSize) {
            this.spinOffset -= this.symbolSize;
            this.rotateSymbols();

            if (this.isAligning) {
                this.speed = 0;
                this.isAligning = false;

                this.snapToGrid();

                break;
            }
        }

        // If we're stopping, slow down the reel
        if (!this.isSpinning && !this.isAligning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < MIN_STOP_SPEED) {
                this.speed = MIN_STOP_SPEED;
                this.isAligning = true;
            }
        }
    }

    private snapToGrid(): void {
        // TODO: Snap symbols to horizontal grid positions  
        this.symbols.sort((a, b) => a.x - b.x);

        this.symbols.forEach((symbol, index) => {
            symbol.x = (index - 1) * this.symbolSize;
        });

        this.spinOffset = 0;
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }

    private rotateSymbols(): void {
        const lastSymbol = this.symbols.pop();

        if (!lastSymbol) return;

        this.symbols.unshift(lastSymbol);

        lastSymbol.x = this.symbols[1].x - this.symbolSize;
    }
}
