import { MemoryType, PeripheralType } from '../types';

export abstract class Component {
    constructor(public readonly name: string) {}
}

export class Processor extends Component {
    constructor(name: string, public cores: number, public freqGhz: number) {
        super(name);
    }
}

export class Memory extends Component {
    private usedGB: number = 0;

    constructor(name: string, public type: MemoryType, public capacityGB: number) {
        super(name);
    }

    allocate(amountGB: number): boolean {
        if (this.usedGB + amountGB <= this.capacityGB) {
            this.usedGB += amountGB;
            return true;
        }
        return false;
    }

    getUsedGB(): number { return this.usedGB; }
    getFreeGB(): number { return this.capacityGB - this.usedGB; }
}

export class Peripheral {
    constructor(public readonly name: string, public readonly type: PeripheralType) {}
}