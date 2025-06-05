import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'game',
    data: { pageTitle: 'Games' },
    loadChildren: () => import('./game/game.routes'),
  },
  {
    path: 'player-game',
    data: { pageTitle: 'PlayerGames' },
    loadChildren: () => import('./player-game/player-game.routes'),
  },
  {
    path: 'user-profile',
    data: { pageTitle: 'UserProfiles' },
    loadChildren: () => import('./user-profile/user-profile.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
