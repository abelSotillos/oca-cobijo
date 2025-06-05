import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 4033,
  nickname: 'deselect ravioli fervently',
};

export const sampleWithPartialData: IUserProfile = {
  id: 9981,
  nickname: 'energetically',
  avatarUrl: 'winged which',
};

export const sampleWithFullData: IUserProfile = {
  id: 9570,
  nickname: 'folklore glisten cuddly',
  avatarUrl: 'guidance second',
};

export const sampleWithNewData: NewUserProfile = {
  nickname: 'ick astride awesome',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
