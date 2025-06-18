import { IPlayerGame, NewPlayerGame } from './player-game.model';

export const sampleWithRequiredData: IPlayerGame = {
  id: 25740,
  position: 1,
  order: 19029,
  blockedTurns: 0,
};

export const sampleWithPartialData: IPlayerGame = {
  id: 22428,
  position: 2,
  order: 1650,
  isWinner: false,
  blockedTurns: 0,
};

export const sampleWithFullData: IPlayerGame = {
  id: 31235,
  position: 3,
  order: 16916,
  isWinner: true,
  blockedTurns: 0,
};

export const sampleWithNewData: NewPlayerGame = {
  position: 4,
  order: 32306,
  blockedTurns: 0,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
