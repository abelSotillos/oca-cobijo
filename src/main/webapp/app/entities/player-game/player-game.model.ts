import { IGame } from 'app/entities/game/game.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IPlayerGame {
  id: number;
  positionx?: number | null;
  positiony?: number | null;
  order?: number | null;
  isWinner?: boolean | null;
  game?: Pick<IGame, 'id'> | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewPlayerGame = Omit<IPlayerGame, 'id'> & { id: null };
