import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlayerGame } from '../player-game.model';
import { PlayerGameService } from '../service/player-game.service';

const playerGameResolve = (route: ActivatedRouteSnapshot): Observable<null | IPlayerGame> => {
  const id = route.params.id;
  if (id) {
    return inject(PlayerGameService)
      .find(id)
      .pipe(
        mergeMap((playerGame: HttpResponse<IPlayerGame>) => {
          if (playerGame.body) {
            return of(playerGame.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default playerGameResolve;
