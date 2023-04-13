export class GeneratorPattern {
    constructor(randomizer = null) {
        this.setRandomizer(randomizer);
        this.tileChance = 30;
    }

    setRandomizer(randomizer) {
        this.randomizer = randomizer;
        if (this.randomizer === null) {
            this.randomizer = this.getDefaultRandomizer();
        } else {
            if (!this.randomizer.generate) {
                console.warn("GeneratorPattern: randomizer.generate is not defined, using default", this.randomizer);
                this.randomizer.generate = this.getDefaultRandomizer().generate;
            }
            if (!this.randomizer.generateTileState) {
                console.warn("GeneratorPattern: randomizer.generateTileState is not defined, using default", this.randomizer);
                this.randomizer.generateTileState = this.getDefaultRandomizer().generateTileState;
            }
        }
    }

    getDefaultRandomizer() {
        return {
            generate: (options) => {
                return Math.round(Math.random() * 100);
            },
            generateTileState: (rnd, x, y, options) => {
                return {
                    type: "tile",
                    value: rnd,
                    isWall: rnd > 50,
                    opacity: rnd
                };
            }
        };
    }

    generate(type = "tiles", patternSize = {x: 10, y: 10}, options = {}) {
        switch (type) {
            case "tiles":
                return this.generateTilePattern(patternSize, options);
            default:
                return this.generateTilePattern(patternSize, options);
        }
    }

    generateTilePattern(patternSize, options = {}) {
        const tiles = [];
        for (let x = 0; x < patternSize.x; x++) {
            for (let y = 0; y < patternSize.y; y++) {
                const randomTile = this.generateRandomTile(x, y, options);
                if (randomTile !== null) {
                    tiles.push(randomTile);
                }
            }
        }
        return tiles;
    }

    generateRandomTile(x = 0, y = 0, options = {}) {
        const rnd = this.randomizer.generate(options);
        if (rnd === undefined || rnd === null || isNaN(rnd) || rnd < 0 || rnd > 100) {
            console.warn("GeneratorPattern: randomizer.generate returned invalid value (should be a number between 0 and 100)", rnd);
        }
        if (rnd > this.tileChance) {
            return null;
        }
        const xOffset = options.xOffset || 0;
        const yOffset = options.yOffset || 0;
        return {
            position: {x: x + xOffset, y: y + yOffset},
            state: this.randomizer.generateTileState(rnd, x, y, options)
        };
    }
}