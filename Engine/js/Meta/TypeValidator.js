export class TypeValidator {
    static validateType(value, constructor) {
        if (value === undefined || value === null) {
            throw new Error(`Invalid value: ${value} (expected ${constructor})`);
        }
        if (value.constructor !== constructor) {
            throw new Error(`Invalid type: ${typeof value} with value ${value} (expected ${constructor})`);
        }
    }

    static validateInstanceOf(instance, Class) {
        if (instance === undefined || instance === null) {
            throw new Error(`Invalid value: ${instance} (expected instance of ${Class})`);
        }
        if (!(instance instanceof Class)) {
            throw new Error(`Invalid type: ${typeof instance} with value ${instance} (expected instance of ${Class})`);
        }
    }
}