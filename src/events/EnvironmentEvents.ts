export class EnvironmentChangedEventArgs {
    constructor(
        public readonly hasPower: boolean,
        public readonly hasNetwork: boolean
    ) {}
}

export type EnvironmentEventHandler = (args: EnvironmentChangedEventArgs) => void;