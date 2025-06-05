import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GameResolve from './route/game-routing-resolve.service';

const gameRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/game.component').then(m => m.GameComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/game-detail.component').then(m => m.GameDetailComponent),
    resolve: {
      game: GameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/game-update.component').then(m => m.GameUpdateComponent),
    resolve: {
      game: GameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/game-update.component').then(m => m.GameUpdateComponent),
    resolve: {
      game: GameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gameRoute;
