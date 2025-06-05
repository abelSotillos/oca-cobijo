import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PlayerGameResolve from './route/player-game-routing-resolve.service';

const playerGameRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/player-game.component').then(m => m.PlayerGameComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/player-game-detail.component').then(m => m.PlayerGameDetailComponent),
    resolve: {
      playerGame: PlayerGameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/player-game-update.component').then(m => m.PlayerGameUpdateComponent),
    resolve: {
      playerGame: PlayerGameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/player-game-update.component').then(m => m.PlayerGameUpdateComponent),
    resolve: {
      playerGame: PlayerGameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default playerGameRoute;
