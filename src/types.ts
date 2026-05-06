export enum ActionType { Work, Play, Communicate, ListenMusic, WatchVideo }
export enum PeripheralType { Display, AudioOutput, AudioInput, InputDevice }
export enum MemoryType { RAM, Storage }

export interface ExecutionResult {
    success: boolean;
    reason?: string;
}