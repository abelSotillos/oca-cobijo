import { IGame, NewGame } from './game.model';

export const sampleWithRequiredData: IGame = {
  id: 8692,
  code: 'entice wetly',
  status: 'FINISHED',
};

export const sampleWithPartialData: IGame = {
  id: 28187,
  code: 'massage howl during',
  status: 'IN_PROGRESS',
};

export const sampleWithFullData: IGame = {
  id: 6329,
  code: 'ah ugh',
  status: 'IN_PROGRESS',
  currentTurn: 26538,
};

export const sampleWithNewData: NewGame = {
  code: 'rationalise ridge righteously',
  status: 'WAITING',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
