export class Binder<T> {
    private readonly type: string;
    private readonly locator: Map<string, any>;

    constructor(type: string, locator: Map<string, any>) {
        this.type = type;
        this.locator = locator;
    }

    to<T>(instance: T) {
        this.locator.set(this.type, instance);
    }
}

export default class ServiceLocator {
    private locator: Map<string, any> = new Map();

    bind<T>(type: string): Binder<T> {
        return new Binder(type, this.locator)
    }

    get<T>(type: string): T {
        return this.locator.get(type)
    }

    list(): Array<string> {
        return Array.from(this.locator.keys());
    }
}

