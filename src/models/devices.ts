import { ActionType, PeripheralType, IObserver, MemoryType } from '../types';
import { Processor, Memory, Peripheral } from './hardware';
import { PowerSource, Battery, UPS } from './power';
import { Software } from './software';
import { Environment } from '../environment';

export abstract class Device implements IObserver {
    protected softwareList: Software[] = [];
    protected peripherals: Peripheral[] = [];
    protected hasNetwork: boolean = true;

    constructor(
        public readonly name: string,
        protected cpu: Processor,
        protected ram: Memory,
        protected storage: Memory,
        protected powerSource: PowerSource,
        public readonly isMobile: boolean = false
    ) {
        Environment.getInstance().subscribe(this);
        this.hasNetwork = Environment.getInstance().getNetworkStatus();
        this.powerSource.setGridPower(Environment.getInstance().getPowerStatus());
    }

    updateEnvironment(p: boolean, n: boolean) {
        this.hasNetwork = n;
        this.powerSource.setGridPower(p);
    }

    connectPeripheral(p: Peripheral) { this.peripherals.push(p); }

    installSoftware(sw: Software): { success: boolean, reason?: string } {
        if (this.softwareList.some(s => s.name === sw.name)) return { success: false, reason: "Програма вже встановлена." };

        if (this.isMobile && !sw.isMobileCompatible) {
            return { success: false, reason: `Програма "${sw.name}" не підтримується на мобільних пристроях.` };
        }

        if (this.storage.allocate(sw.requiredStorageGB)) {
            this.softwareList.push(sw);
            return { success: true };
        }
        return { success: false, reason: "Недостатньо місця на SSD." };
    }

    isInstalled(action: ActionType): boolean {
        return this.softwareList.some(s => s.actionType === action);
    }

    executeAction(action: ActionType, hours: number): { success: boolean, reason?: string } {
        const sw = this.softwareList.find(s => s.actionType === action);
        if (!sw) return { success: false, reason: "ПЗ не встановлено. Зайдіть у 'Центр завантажень', щоб встановити." };

        if (sw.requiresNetwork && !this.hasNetwork) return { success: false, reason: "Відсутній інтернет (необхідно для цієї дії)." };
        if (this.ram.getFreeGB() < sw.requiredRamGB) return { success: false, reason: "Недостатньо оперативної пам'яті." };

        const hasDisplay = this.peripherals.some(p => p.type === PeripheralType.Display);
        const hasAudioOut = this.peripherals.some(p => p.type === PeripheralType.AudioOutput);
        const hasAudioIn = this.peripherals.some(p => p.type === PeripheralType.AudioInput);
        const hasInput = this.peripherals.some(p => p.type === PeripheralType.InputDevice);

        if ((action === ActionType.Play || action === ActionType.WatchVideo) && !hasDisplay) return { success: false, reason: "Потрібен монітор/екран." };
        if ((action === ActionType.ListenMusic || action === ActionType.WatchVideo || action === ActionType.Play) && !hasAudioOut) return { success: false, reason: "Відсутні динаміки/навушники." };
        if (action === ActionType.Communicate && (!hasAudioOut || !hasAudioIn)) return { success: false, reason: "Потрібен мікрофон та динаміки для спілкування." };
        if ((action === ActionType.Work || action === ActionType.Play) && !hasInput) return { success: false, reason: "Відсутній пристрій вводу (клавіатура/миша/сенсор)." };

        const isHeavy = action === ActionType.Play || action === ActionType.WatchVideo;
        if (!this.powerSource.consume(hours, isHeavy)) return { success: false, reason: "Пристрій вимкнувся: недостатньо заряду." };

        return { success: true };
    }

    getSystemInfo(): string {
        return `ЦП: ${this.cpu.name} | RAM: ${this.ram.getFreeGB()}ГБ | SSD: ${this.storage.getFreeGB()}ГБ | Заряд: ${this.powerSource.getChargeLevel().toFixed(1)}%`;
    }
}

export class PC extends Device {
    constructor() {
        super("ПК", new Processor("Intel Core i9", 16, 4.2), new Memory("DDR5", MemoryType.RAM, 32), new Memory("SSD NVMe", MemoryType.Storage, 1000), new UPS(), false);
    }
}

export class Laptop extends Device {
    constructor() {
        super("Ноутбук", new Processor("AMD Ryzen 5", 6, 3.3), new Memory("DDR4", MemoryType.RAM, 16), new Memory("SSD", MemoryType.Storage, 512), new Battery(6000), false);
        this.connectPeripheral(new Peripheral("Екран", PeripheralType.Display));
        this.connectPeripheral(new Peripheral("Клавіатура", PeripheralType.InputDevice));
        this.connectPeripheral(new Peripheral("Динаміки", PeripheralType.AudioOutput));
        this.connectPeripheral(new Peripheral("Мікрофон", PeripheralType.AudioInput));
    }
}

export class Smartphone extends Device {
    constructor() {
        super("Смартфон", new Processor("Snapdragon", 8, 2.8), new Memory("LPDDR5", MemoryType.RAM, 8), new Memory("UFS", MemoryType.Storage, 128), new Battery(3000), true);
        this.connectPeripheral(new Peripheral("Сенсорний екран", PeripheralType.Display));
        this.connectPeripheral(new Peripheral("Сенсорний екран (Ввід)", PeripheralType.InputDevice));
        this.connectPeripheral(new Peripheral("Динамік", PeripheralType.AudioOutput));
        this.connectPeripheral(new Peripheral("Мікрофон", PeripheralType.AudioInput));
    }
}