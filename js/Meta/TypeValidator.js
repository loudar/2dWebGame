export class TypeValidator {
    static validateType(value, constructor) {
        if (value.constructor !== constructor) {
            throw new Error(`Invalid type: ${typeof value} with value ${value} (expected ${constructor})`);
        }
    }
}