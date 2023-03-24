export class DataManager {
    static dataStore = window.gameStore;

    static ensureDataStore() {
        if (!this.dataStore) {
            this.dataStore = {};
        }
    }

    static addOrUpdateKey(key, data) {
        this.ensureDataStore();
        this.dataStore[key] = data;
    }

    static getKey(key) {
        this.ensureDataStore();
        return this.dataStore[key];
    }

    static removeKey(key) {
        this.ensureDataStore();
        delete this.dataStore[key];
    }

    static clear() {
        this.ensureDataStore();
        this.dataStore = {};
    }

    static getStore() {
        this.ensureDataStore();
        return this.dataStore;
    }

    static setStore(store) {
        this.dataStore = store;
    }

    static getStoreKeys() {
        this.ensureDataStore();
        return Object.keys(this.dataStore);
    }

    static addToArrayKey(key, data) {
        this.ensureDataStore();
        if (!this.dataStore[key]) {
            this.dataStore[key] = [];
        }
        this.dataStore[key].push(data);
    }

    static getArrayKey(key) {
        this.ensureDataStore();
        if (!this.dataStore[key]) {
            this.dataStore[key] = [];
        }
        return this.dataStore[key];
    }

    static removeFromArrayKey(key, data) {
        this.ensureDataStore();
        if (!this.dataStore[key]) {
            return;
        }
        const index = this.dataStore[key].indexOf(data);
        if (index > -1) {
            this.dataStore[key].splice(index, 1);
        }
    }

    static clearArrayKey(key) {
        this.ensureDataStore();
        this.dataStore[key] = [];
    }

    static getArrayKeyLength(key) {
        this.ensureDataStore();
        if (!this.dataStore[key]) {
            return 0;
        }
        return this.dataStore[key].length;
    }

    static getArrayKeyItem(key, index) {
        this.ensureDataStore();
        if (!this.dataStore[key]) {
            return null;
        }
        return this.dataStore[key][index];
    }

    static setArrayKeyItem(key, index, data) {
        this.ensureDataStore();
        if (!this.dataStore[key]) {
            return;
        }
        this.dataStore[key][index] = data;
    }
}