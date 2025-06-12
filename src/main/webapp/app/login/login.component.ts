import { AfterViewInit, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

@Component({
  selector: 'jhi-login',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent implements OnInit, AfterViewInit {
  username = viewChild.required<ElementRef>('username');

  authenticationError = signal(false);

  guestForm = new FormGroup({
    nickname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  private readonly accountService = inject(AccountService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly stateStorageService = inject(StateStorageService);

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.username().nativeElement.focus();
  }

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authenticationError.set(false);
        if (!this.router.getCurrentNavigation()) {
          this.router.navigate(['']);
        }
      },
      error: () => this.authenticationError.set(true),
    });
  }

  loginGuest(): void {
    const nickname = this.guestForm.get('nickname')!.value;
    this.loginService.guestLogin(nickname).subscribe({
      next: (profile: IUserProfile) => {
        localStorage.setItem('session_id', profile.sessionId ?? '');
        const previousUrl = this.stateStorageService.getUrl();
        if (previousUrl) {
          this.stateStorageService.clearUrl();
          this.router.navigateByUrl(previousUrl);
        } else {
          this.router.navigate(['']);
        }
      },
    });
  }
}
