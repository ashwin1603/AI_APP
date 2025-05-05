import { lerp, getRGBA } from './utils.js';

export default class NeuralNetwork {
    constructor(neuronCounts) {
        if (!neuronCounts || neuronCounts.length < 2) {
            throw new Error('NeuralNetwork requires at least 2 layer sizes');
        }

        this.levels = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    static feedForward(givenInputs, network) {
        if (!givenInputs || !network || !network.levels.length) {
            throw new Error('Invalid inputs or network');
        }

        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }

    static mutate(network, amount = 1) {
        if (!network || amount < 0 || amount > 1) {
            throw new Error('Invalid mutation parameters');
        }

        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                );
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    );
                }
            }
        });
    }
}

class Level {
    constructor(inputCount, outputCount) {
        if (inputCount <= 0 || outputCount <= 0) {
            throw new Error('Level requires positive input and output counts');
        }

        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = Array.from({ length: inputCount }, () => 
            new Array(outputCount).fill(0)
        );

        Level.#randomize(this);
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {
        if (!givenInputs || givenInputs.length !== level.inputs.length) {
            throw new Error('Input size mismatch');
        }

        // Copy inputs
        level.inputs = [...givenInputs];

        // Calculate outputs
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            // Step function activation
            level.outputs[i] = sum > level.biases[i] ? 1 : 0;
        }

        return level.outputs;
    }
}