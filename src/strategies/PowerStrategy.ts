export interface IPowerConsumptionStrategy {
    calculateDrainPercent(hours: number, isHeavy: boolean): number;
}

export class BatteryStrategy implements IPowerConsumptionStrategy {
    constructor(private capacityMAh: number) {}

    calculateDrainPercent(hours: number, isHeavy: boolean): number {
        let maxHours = 0;
        if (this.capacityMAh >= 2000 && this.capacityMAh <= 3000) maxHours = isHeavy ? 16 : 48;
        else if (this.capacityMAh >= 5000 && this.capacityMAh <= 7000) maxHours = isHeavy ? 4 : 12;
        else maxHours = isHeavy ? 2 : 6;

        return (hours / maxHours) * 100;
    }
}

export class UPSStrategy implements IPowerConsumptionStrategy {
    calculateDrainPercent(hours: number, isHeavy: boolean): number {
        return (hours / 0.5) * 100;
    }
}