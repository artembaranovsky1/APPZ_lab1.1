import { ActionType } from '../types';

export class Software {
    constructor(
        public name: string,
        public actionType: ActionType,
        public requiresNetwork: boolean,
        public requiredStorageGB: number,
        public requiredRamGB: number,
        public isMobileCompatible: boolean = true
    ) {}
}