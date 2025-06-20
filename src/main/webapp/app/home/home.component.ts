import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { GameService } from 'app/entities/game/service/game.service';
import { IGame } from 'app/entities/game/game.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);
  games = signal<IGame[]>([]);

  private readonly destroy$ = new Subject<void>();

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);
  private readonly userProfileService = inject(UserProfileService);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        if (account !== null) {
          this.account.set(account);
          this.loadGames();
          return;
        }
      });
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
      this.loadGames();
    } else {
      this.router.navigate(['/login']);
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  createRoom(): void {
    this.gameService.createRoom().subscribe(res => {
      const code = res.body?.code;
      if (code) {
        this.router.navigate(['/room', code]);
      }
    });
  }

  openGame(game: IGame): void {
    if (game.code) {
      this.router.navigate(['/room', game.code]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGames(): void {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.login();
      return;
    }
    this.userProfileService.findBySession(sessionId).subscribe({
      // eslint-disable-next-line object-shorthand
      next: profileRes => {
        const profile = profileRes.body;
        if (profile?.id != null) {
          this.gameService.findByUser(profile.id).subscribe(res => {
            this.games.set(res.body ?? []);
          });
        } else {
          localStorage.removeItem('session_id');
        }
      },
      // eslint-disable-next-line object-shorthand
      error: () => {
        localStorage.removeItem('session_id');
      },
    });
  }
}
