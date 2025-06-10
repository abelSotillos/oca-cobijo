import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { Login } from './login.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly accountService = inject(AccountService);
  private readonly authServerProvider = inject(AuthServerProvider);
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
  }

  guestLogin(nickname: string): Observable<IUserProfile> {
    return this.http.post<IUserProfile>(this.applicationConfigService.getEndpointFor('api/user-profiles/guest'), { nickname });
  }
}
