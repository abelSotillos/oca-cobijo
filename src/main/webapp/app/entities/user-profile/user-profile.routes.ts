import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import UserProfileResolve from './route/user-profile-routing-resolve.service';

const userProfileRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/user-profile.component').then(m => m.UserProfileComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/user-profile-detail.component').then(m => m.UserProfileDetailComponent),
    resolve: {
      userProfile: UserProfileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/user-profile-update.component').then(m => m.UserProfileUpdateComponent),
    resolve: {
      userProfile: UserProfileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/user-profile-update.component').then(m => m.UserProfileUpdateComponent),
    resolve: {
      userProfile: UserProfileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userProfileRoute;
