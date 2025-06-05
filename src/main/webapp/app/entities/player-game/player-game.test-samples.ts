import { IPlayerGame, NewPlayerGame } from './player-game.model';

export const sampleWithRequiredData: IPlayerGame = {
  id: 25740,
  positionx: 26127,
  positiony: 6784,
  order: 19029,
};

export const sampleWithPartialData: IPlayerGame = {
  id: 22428,
  positionx: 13398,
  positiony: 2516,
  order: 1650,
  isWinner: false,
};

export const sampleWithFullData: IPlayerGame = {
  id: 31235,
  positionx: 14656,
  positiony: 18929,
  order: 16916,
  isWinner: true,
};

export const sampleWithNewData: NewPlayerGame = {
  positionx: 27405,
  positiony: 2785,
  order: 32306,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
