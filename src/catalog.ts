import { ActionType } from './types';
import { Software } from './models/software';

export const catalog = {
    office: new Software("Office Online", ActionType.Work, true, 5, 1, true),
    game: new Software("The Witcher 3", ActionType.Play, false, 60, 8, false),
    telegram: new Software("Telegram", ActionType.Communicate, true, 1, 0.5, true),
    spotify: new Software("Spotify", ActionType.ListenMusic, false, 0.5, 0.2, true),
    youtube: new Software("YouTube", ActionType.WatchVideo, true, 1, 0.5, true)
};