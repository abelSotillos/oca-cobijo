import { IGame } from 'app/entities/game/game.model';
import { IUser } from 'app/entities/user/user.model';

export interface IUserProfile {
  id: number;
  nickname?: string | null;
  avatarUrl?: string | null;
  sessionId?: string | null;
  games?: Pick<IGame, 'id'>[] | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
