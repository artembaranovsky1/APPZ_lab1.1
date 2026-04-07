import * as readline from 'readline';
import { ActionType, PeripheralType } from './types';
import { Peripheral } from './models/hardware';
import { Environment } from './environment';
import { Device, PC, Laptop, Smartphone } from './models/devices';
import { catalog } from './catalog';

export class CLI {
    private rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    private env = Environment.getInstance();

    private devices = { pc: new PC(), laptop: new Laptop(), phone: new Smartphone() };
    private current: Device | null = null;

    constructor() {
        const preInstalledApps = [catalog.spotify, catalog.youtube];
        Object.values(this.devices).forEach(device => {
            preInstalledApps.forEach(app => device.installSoftware(app));
        });
    }

    start() { this.mainMenu(); }

    private mainMenu() {
        console.log(`\n=== ГОЛОВНЕ МЕНЮ === | Світло: ${this.env.getPowerStatus() ? "Є" : "Немає"} | Інтернет: ${this.env.getNetworkStatus() ? "Є" : "Немає"}`);
        console.log("1. ПК");
        console.log("2. Ноутбук");
        console.log("3. Смартфон");
        console.log("0. Вихід");

        this.rl.question("> ", a => {
            if (a === '1') { this.current = this.devices.pc; this.deviceMenu(); }
            else if (a === '2') { this.current = this.devices.laptop; this.deviceMenu(); }
            else if (a === '3') { this.current = this.devices.phone; this.deviceMenu(); }
            else if (a === '0') { this.rl.close(); process.exit(); }
            else { this.mainMenu(); }
        });
    }

    private downloadMenu() {
        if (!this.current) return this.mainMenu();

        console.log(`\n=== ЦЕНТР ЗАВАНТАЖЕНЬ ===\n[Стан] ${this.current.getSystemInfo()}`);
        console.log(`1. Встановити Office (5 ГБ)     [${this.current.isInstalled(ActionType.Work) ? 'Вже встановлено' : 'Встановити'}]`);
        console.log(`2. Встановити Witcher 3 (60 ГБ) [${this.current.isInstalled(ActionType.Play) ? 'Вже встановлено' : 'Встановити'}]`);
        console.log(`3. Встановити Telegram (1 ГБ)   [${this.current.isInstalled(ActionType.Communicate) ? 'Вже встановлено' : 'Встановити'}]`);
        console.log("0. Назад до меню пристрою");

        this.rl.question("> ", a => {
            let res;
            switch (a) {
                case '1': res = this.current!.installSoftware(catalog.office); break;
                case '2': res = this.current!.installSoftware(catalog.game); break;
                case '3': res = this.current!.installSoftware(catalog.telegram); break;
                case '0': return this.deviceMenu();
                default: return this.downloadMenu();
            }

            if (res) {
                if (res.success) console.log("\n[+] Успішно встановлено! Місце на SSD оновлено.");
                else console.log(`\n[-] Неможливо встановити: ${res.reason}`);
            }
            this.downloadMenu();
        });
    }

    private deviceMenu() {
        if (!this.current) return this.mainMenu();

        console.log(`\n=== ${this.current.name} ===\n[Стан] ${this.current.getSystemInfo()}`);
        console.log("--- ВИКОРИСТАННЯ (кожна дія 1 год) ---");
        console.log(`1. Працювати   [${this.current.isInstalled(ActionType.Work) ? 'Інстальовано' : 'Не інстальовано'}]`);
        console.log(`2. Грати       [${this.current.isInstalled(ActionType.Play) ? 'Інстальовано' : 'Не інстальовано'}]`);
        console.log(`3. Спілкуватись[${this.current.isInstalled(ActionType.Communicate) ? 'Інстальовано' : 'Не інстальовано'}]`);
        console.log(`4. Музика      [${this.current.isInstalled(ActionType.ListenMusic) ? 'Інстальовано' : 'Не інстальовано'}]`);
        console.log(`5. YouTube     [${this.current.isInstalled(ActionType.WatchVideo) ? 'Інстальовано' : 'Не інстальовано'}]`);
        console.log("--- ІНШЕ ---");
        console.log("6. Центр завантажень");
        console.log("7. Підключити периферію");
        console.log(`8. Перемкнути світло (Зараз: ${this.env.getPowerStatus() ? "Є" : "Немає"})`);
        console.log(`9. Перемкнути інтернет (Зараз: ${this.env.getNetworkStatus() ? "Є" : "Немає"})`);
        console.log("0. Назад");

        this.rl.question("> ", a => {
            let res;
            let actionMsg = "";

            switch (a) {
                case '1':
                    res = this.current!.executeAction(ActionType.Work, 1);
                    actionMsg = "Було виконано роботу в Office Online";
                    break;
                case '2':
                    res = this.current!.executeAction(ActionType.Play, 1);
                    actionMsg = "Ви пограли в The Witcher 3";
                    break;
                case '3':
                    res = this.current!.executeAction(ActionType.Communicate, 1);
                    actionMsg = "Поспілкувалися";
                    break;
                case '4':
                    res = this.current!.executeAction(ActionType.ListenMusic, 1);
                    actionMsg = "Ви послухали музику у Spotify";
                    break;
                case '5':
                    res = this.current!.executeAction(ActionType.WatchVideo, 1);
                    actionMsg = "Ви подивилися відео на YouTube";
                    break;
                case '6': return this.downloadMenu();
                case '7':
                    this.current!.connectPeripheral(new Peripheral("Монітор", PeripheralType.Display));
                    this.current!.connectPeripheral(new Peripheral("Клавіатура", PeripheralType.InputDevice));
                    this.current!.connectPeripheral(new Peripheral("Навушники", PeripheralType.AudioOutput));
                    this.current!.connectPeripheral(new Peripheral("Мікрофон", PeripheralType.AudioInput));
                    console.log("\n[!] Всю необхідну периферію підключено.");
                    return this.deviceMenu();
                case '8': this.env.setPower(!this.env.getPowerStatus()); return this.deviceMenu();
                case '9': this.env.setNetwork(!this.env.getNetworkStatus()); return this.deviceMenu();
                case '0': this.current = null; return this.mainMenu();
                default: return this.deviceMenu();
            }

            if (res) {
                if (res.success) {
                    console.log(`\n[+] ${actionMsg} (витрачено 1 годину).`);
                } else {
                    console.log(`\n[-] Неможливо виконати: ${res.reason}`);
                }
            }
            this.deviceMenu();
        });
    }
}