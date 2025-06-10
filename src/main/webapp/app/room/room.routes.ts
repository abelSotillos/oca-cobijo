import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const roomRoutes: Routes = [
  {
    path: ':code',
    loadComponent: () => import('./room.component'),
    canActivate: [UserRouteAccessService],
    data: { pageTitle: 'Sala' },
  },
];

export default roomRoutes;
