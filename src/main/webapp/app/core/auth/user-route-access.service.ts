import { inject, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from './state-storage.service';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

export const UserRouteAccessService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const stateStorageService = inject(StateStorageService);
  const userProfileService = inject(UserProfileService);
  return accountService.identity().pipe(
    switchMap(account => {
      if (account) {
        const { authorities } = next.data;

        if (!authorities || authorities.length === 0 || accountService.hasAnyAuthority(authorities)) {
          return of(true);
        }

        if (isDevMode()) {
          console.error('User does not have any of the required authorities:', authorities);
        }
        router.navigate(['accessdenied']);
        return of(false);
      }

      const guestSession = localStorage.getItem('session_id');
      if (guestSession) {
        return userProfileService.findBySession(guestSession).pipe(
          map(profileRes => {
            if (profileRes.body) {
              return true;
            }
            localStorage.removeItem('session_id');
            stateStorageService.storeUrl(state.url);
            router.navigate(['/login']);
            return false;
          }),
          catchError(() => {
            localStorage.removeItem('session_id');
            stateStorageService.storeUrl(state.url);
            router.navigate(['/login']);
            return of(false);
          }),
        );
      }

      stateStorageService.storeUrl(state.url);
      router.navigate(['/login']);
      return of(false);
    }),
  );
};
