import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGame } from '../game.model';
import { GameService } from '../service/game.service';

const gameResolve = (route: ActivatedRouteSnapshot): Observable<null | IGame> => {
  const id = route.params.id;
  if (id) {
    return inject(GameService)
      .find(id)
      .pipe(
        mergeMap((game: HttpResponse<IGame>) => {
          if (game.body) {
            return of(game.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gameResolve;
