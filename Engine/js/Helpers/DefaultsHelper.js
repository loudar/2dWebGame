export class DefaultsHelper {
    static overWriteKeys(defaultObject, overWriteObject) {
        if (!overWriteObject) {
            return defaultObject;
        }
        for (const key in defaultObject) {
            if (!overWriteObject.hasOwnProperty(key)) {
                overWriteObject[key] = defaultObject[key];
            }
        }
        return overWriteObject;
    }
}