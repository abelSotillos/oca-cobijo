import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';

const userProfileResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserProfile> => {
  const id = route.params.id;
  const sessionId = route.params.sessionId;
  const service = inject(UserProfileService);
  if (id) {
    return service.find(id).pipe(
      mergeMap((userProfile: HttpResponse<IUserProfile>) => {
        if (userProfile.body) {
          return of(userProfile.body);
        }
        inject(Router).navigate(['404']);
        return EMPTY;
      }),
    );
  }
  if (sessionId) {
    return service.findBySession(sessionId).pipe(
      mergeMap((userProfile: HttpResponse<IUserProfile>) => {
        if (userProfile.body) {
          return of(userProfile.body);
        }
        inject(Router).navigate(['404']);
        return EMPTY;
      }),
    );
  }
  return of(null);
};

export default userProfileResolve;
