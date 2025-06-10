import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PhaserGameComponent } from '../phaser-game/phaser-game.component';
import { GameService } from 'app/entities/game/service/game.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, PhaserGameComponent],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        if (account === null) {
          this.router.navigate(['/login']);
        } else {
          this.account.set(account);
        }
      });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
