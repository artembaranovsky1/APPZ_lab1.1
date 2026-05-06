import { IPowerConsumptionStrategy, BatteryStrategy, UPSStrategy } from '../strategies/PowerStrategy';

export abstract class PowerSource {
    protected currentChargePercent: number = 100;
    protected hasGridPower: boolean = true;

    constructor(protected strategy: IPowerConsumptionStrategy) {}

    setGridPower(status: boolean): void {
        this.hasGridPower = status;
        if (status) this.currentChargePercent = 100;
    }

    getChargeLevel(): number { return this.currentChargePercent; }

    consume(hours: number, isHeavy: boolean): boolean {
        if (this.hasGridPower) return true;

        const drain = this.strategy.calculateDrainPercent(hours, isHeavy);

        if (this.currentChargePercent >= drain) {
            this.currentChargePercent -= drain;
            return true;
        }
        this.currentChargePercent = 0;
        return false;
    }
}

export class Battery extends PowerSource {
    constructor(capacityMAh: number) {
        super(new BatteryStrategy(capacityMAh));
    }
}

export class UPS extends PowerSource {
    constructor() {
        super(new UPSStrategy());
    }
}