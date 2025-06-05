import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { GameStatus } from 'app/entities/enumerations/game-status.model';

export interface IGame {
  id: number;
  code?: string | null;
  status?: keyof typeof GameStatus | null;
  currentTurn?: number | null;
  userProfiles?: Pick<IUserProfile, 'id'>[] | null;
}

export type NewGame = Omit<IGame, 'id'> & { id: null };
