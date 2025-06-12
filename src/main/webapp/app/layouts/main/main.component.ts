import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, PageRibbonComponent, SharedModule],
})
export default class MainComponent implements OnInit {
  isLoggin = true;
  private readonly router = inject(Router);
  private readonly appPageTitleStrategy = inject(AppPageTitleStrategy);
  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
    this.router.events.subscribe({
      next: () => {
        if (this.router.url === '/login' || this.router.url === '/account/register' || this.router.url.includes('/account/reset')) {
          this.isLoggin = true;
        } else {
          this.isLoggin = false;
        }
      },
    });
  }
}
