jest.mock('app/core/auth/account.service');
jest.mock('phaser', () => ({
  Game: jest.fn().mockImplementation(() => ({ destroy: jest.fn() })),
  Scene: class {},
  AUTO: 0,
  GameObjects: { Image: class {} },
}));

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { GameService } from 'app/entities/game/service/game.service';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import HomeComponent from './home.component';

describe('Home Component', () => {
  let comp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAccountService: AccountService;
  let mockRouter: Router;
  let mockGameService: GameService;
  let mockUserProfileService: UserProfileService;
  const account: Account = {
    activated: true,
    authorities: [],
    email: '',
    firstName: null,
    langKey: '',
    lastName: null,
    login: 'login',
    imageUrl: null,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [AccountService, GameService, UserProfileService, provideHttpClient()],
    })
      .overrideTemplate(HomeComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    comp = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));

    mockGameService = TestBed.inject(GameService);
    jest.spyOn(mockGameService, 'findByUser').mockReturnValue(of(new HttpResponse({ body: [] })));

    mockUserProfileService = TestBed.inject(UserProfileService);
    jest.spyOn(mockUserProfileService, 'findBySession').mockReturnValue(of(new HttpResponse({ body: { id: 1 } })));

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
  });

  describe('ngOnInit', () => {
    it('Should synchronize account variable with current account and redirect on missing session', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      comp.ngOnInit();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(comp.account()).toEqual(account);

      // WHEN
      authenticationState.next(null);

      // THEN
      expect(comp.account()).toEqual(account);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('Should not redirect when session id exists', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());
      localStorage.setItem('session_id', 's1');

      // WHEN
      comp.ngOnInit();
      authenticationState.next(null);

      // THEN
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      localStorage.removeItem('session_id');
    });
  });

  describe('login', () => {
    it('Should navigate to /login on login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('searchRoom', () => {
    it('should navigate to room when game is found', () => {
      jest.spyOn(mockGameService, 'findByCode').mockReturnValue(of(new HttpResponse({ body: { id: 1, code: 'xyz' } })));
      comp.roomCode.setValue('xyz');

      comp.searchRoom();

      expect(mockGameService.findByCode).toHaveBeenCalledWith('xyz');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/room', 'xyz']);
    });
  });

  describe('ngOnDestroy', () => {
    it('Should destroy authentication state subscription on component destroy', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account()).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(comp.account()).toEqual(account);

      // WHEN
      comp.ngOnDestroy();
      authenticationState.next(null);

      // THEN
      expect(comp.account()).toEqual(account);
    });
  });
});
