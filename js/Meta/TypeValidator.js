export class TypeValidator {
    static validateType(value, constructor) {
        if (value === undefined || value === null) {
            throw new Error(`Invalid value: ${value} (expected ${constructor})`);
        }
        if (value.constructor !== constructor) {
            throw new Error(`Invalid type: ${typeof value} with value ${value} (expected ${constructor})`);
        }
    }
}