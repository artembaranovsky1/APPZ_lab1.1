export abstract class PowerSource {
    protected currentChargePercent: number = 100;
    protected hasGridPower: boolean = true;

    setGridPower(status: boolean): void {
        this.hasGridPower = status;
        if (status) this.currentChargePercent = 100;
    }

    getChargeLevel(): number { return this.currentChargePercent; }

    abstract consume(hours: number, isHeavy: boolean): boolean;
}

export class Battery extends PowerSource {
    constructor(private capacityMAh: number) { super(); }

    consume(hours: number, isHeavy: boolean): boolean {
        if (this.hasGridPower) return true;

        let maxHours = 0;
        if (this.capacityMAh >= 2000 && this.capacityMAh <= 3000) maxHours = isHeavy ? 16 : 48;
        else if (this.capacityMAh >= 5000 && this.capacityMAh <= 7000) maxHours = isHeavy ? 4 : 12;
        else return false;

        const drain: number = (hours / maxHours) * 100;

        if (this.currentChargePercent >= drain) {
            this.currentChargePercent -= drain;
            return true;
        }
        this.currentChargePercent = 0;
        return false;
    }
}

export class UPS extends PowerSource {
    consume(hours: number, isHeavy: boolean): boolean {
        if (this.hasGridPower) return true;
        const drain = (hours / 0.5) * 100; // ДБЖ (максимум 30 хв = 0.5 год)

        if (this.currentChargePercent >= drain) {
            this.currentChargePercent -= drain;
            return true;
        }
        this.currentChargePercent = 0;
        return false;
    }
}