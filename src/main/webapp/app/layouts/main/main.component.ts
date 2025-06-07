import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, FooterComponent, PageRibbonComponent],
})
export default class MainComponent implements OnInit {
  isLoggin = true;
  private readonly router = inject(Router);
  private readonly appPageTitleStrategy = inject(AppPageTitleStrategy);
  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
    this.accountService.identity().subscribe(res => {
      if (res === null) {
        this.router.navigate(['/login']);
        this.isLoggin = true;
      } else {
        this.isLoggin = false;
      }
    });
    this.router.events.subscribe({
      next: () => {
        if (this.router.url === '/login') {
          this.isLoggin = true;
        } else {
          this.isLoggin = false;
        }
      },
    });
  }
}
