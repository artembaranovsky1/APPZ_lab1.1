classDiagram
    class IObserver {
        <<interface>>
        +updateEnvironment(power: boolean, network: boolean): void
    }

    class Environment {
        -static instance: Environment
        -powerGrid: boolean
        -network: boolean
        -observers: IObserver[]
        -Environment()
        +static getInstance(): Environment
        +subscribe(obs: IObserver): void
        +setPower(s: boolean): void
        +setNetwork(s: boolean): void
        +getPowerStatus(): boolean
        +getNetworkStatus(): boolean
        -notify(): void
    }

    class Component {
        <<abstract>>
        +name: string
    }

    class Processor {
        +cores: number
        +freqGhz: number
    }

    class Memory {
        -usedGB: number
        +type: MemoryType
        +capacityGB: number
        +allocate(amountGB: number): boolean
        +getUsedGB(): number
        +getFreeGB(): number
    }

    class Peripheral {
        +name: string
        +type: PeripheralType
    }

    class PowerSource {
        <<abstract>>
        #currentChargePercent: number
        #hasGridPower: boolean
        +setGridPower(status: boolean): void
        +getChargeLevel(): number
        +consume(hours: number, isHeavy: boolean): boolean
    }

    class Battery {
        -capacityMAh: number
        +consume(hours: number, isHeavy: boolean): boolean
    }

    class UPS {
        +consume(hours: number, isHeavy: boolean): boolean
    }

    class Software {
        +name: string
        +actionType: ActionType
        +requiresNetwork: boolean
        +requiredStorageGB: number
        +requiredRamGB: number
        +isMobileCompatible: boolean
    }

    class Device {
        <<abstract>>
        +name: string
        +isMobile: boolean
        #softwareList: Software[]
        #peripherals: Peripheral[]
        #hasNetwork: boolean
        #cpu: Processor
        #ram: Memory
        #storage: Memory
        #powerSource: PowerSource
        +updateEnvironment(p: boolean, n: boolean): void
        +connectPeripheral(p: Peripheral): void
        +installSoftware(sw: Software): object
        +isInstalled(action: ActionType): boolean
        +executeAction(action: ActionType, hours: number): object
        +getSystemInfo(): string
    }

    class PC {
    }

    class Laptop {
    }

    class Smartphone {
    }

    class CLI {
        -rl: readline
        -env: Environment
        -devices: object
        -current: Device
        +start(): void
        -mainMenu(): void
        -downloadMenu(): void
        -deviceMenu(): void
    }

    %% Реалізація інтерфейсів (implements)
    IObserver <|.. Device

    %% Наслідування (extends)
    Component <|-- Processor
    Component <|-- Memory
    PowerSource <|-- Battery
    PowerSource <|-- UPS
    Device <|-- PC
    Device <|-- Laptop
    Device <|-- Smartphone

    %% Асоціації, Агрегація та Композиція (зв'язки)
    Environment --> IObserver : notifies
    Device --> Processor : has
    Device --> Memory : has
    Device --> PowerSource : uses
    Device --> Peripheral : aggregates
    Device --> Software : installs
    CLI --> Device : manages
    CLI --> Environment : interacts
