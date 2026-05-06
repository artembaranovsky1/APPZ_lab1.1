import { EnvironmentChangedEventArgs, EnvironmentEventHandler } from './events/EnvironmentEvents';

export class Environment {
    private static instance: Environment;
    private powerGrid: boolean = true;
    private network: boolean = true;

    private handlers: EnvironmentEventHandler[] = [];

    private constructor() {}

    static getInstance() {
        return this.instance || (this.instance = new Environment());
    }

    subscribe(handler: EnvironmentEventHandler) {
        this.handlers.push(handler);
    }

    unsubscribe(handler: EnvironmentEventHandler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    setPower(status: boolean) {
        this.powerGrid = status;
        this.notify();
    }

    setNetwork(status: boolean) {
        this.network = status;
        this.notify();
    }

    getPowerStatus() { return this.powerGrid; }
    getNetworkStatus() { return this.network; }


    private notify() {
        const args = new EnvironmentChangedEventArgs(this.powerGrid, this.network);
        this.handlers.forEach(h => h(args));
    }
}