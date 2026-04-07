import { IObserver } from './types';

export class Environment {
    private static instance: Environment;
    private powerGrid: boolean = true;
    private network: boolean = true;
    private observers: IObserver[] = [];

    private constructor() {}

    static getInstance() {
        return this.instance || (this.instance = new Environment());
    }

    subscribe(obs: IObserver) { this.observers.push(obs); }
    setPower(s: boolean) { this.powerGrid = s; this.notify(); }
    setNetwork(s: boolean) { this.network = s; this.notify(); }
    getPowerStatus() { return this.powerGrid; }
    getNetworkStatus() { return this.network; }

    private notify() {
        this.observers.forEach(o => o.updateEnvironment(this.powerGrid, this.network));
    }
}