import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IGame } from 'app/entities/game/game.model';
import { GameService } from 'app/entities/game/service/game.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IPlayerGame } from '../player-game.model';
import { PlayerGameService } from '../service/player-game.service';
import { PlayerGameFormService } from './player-game-form.service';

import { PlayerGameUpdateComponent } from './player-game-update.component';

describe('PlayerGame Management Update Component', () => {
  let comp: PlayerGameUpdateComponent;
  let fixture: ComponentFixture<PlayerGameUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let playerGameFormService: PlayerGameFormService;
  let playerGameService: PlayerGameService;
  let gameService: GameService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlayerGameUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PlayerGameUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlayerGameUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    playerGameFormService = TestBed.inject(PlayerGameFormService);
    playerGameService = TestBed.inject(PlayerGameService);
    gameService = TestBed.inject(GameService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Game query and add missing value', () => {
      const playerGame: IPlayerGame = { id: 10798 };
      const game: IGame = { id: 7137 };
      playerGame.game = game;

      const gameCollection: IGame[] = [{ id: 7137 }];
      jest.spyOn(gameService, 'query').mockReturnValue(of(new HttpResponse({ body: gameCollection })));
      const additionalGames = [game];
      const expectedCollection: IGame[] = [...additionalGames, ...gameCollection];
      jest.spyOn(gameService, 'addGameToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ playerGame });
      comp.ngOnInit();

      expect(gameService.query).toHaveBeenCalled();
      expect(gameService.addGameToCollectionIfMissing).toHaveBeenCalledWith(
        gameCollection,
        ...additionalGames.map(expect.objectContaining),
      );
      expect(comp.gamesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const playerGame: IPlayerGame = { id: 10798 };
      const userProfile: IUserProfile = { id: 22058 };
      playerGame.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 22058 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ playerGame });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining),
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const playerGame: IPlayerGame = { id: 10798 };
      const game: IGame = { id: 7137 };
      playerGame.game = game;
      const userProfile: IUserProfile = { id: 22058 };
      playerGame.userProfile = userProfile;

      activatedRoute.data = of({ playerGame });
      comp.ngOnInit();

      expect(comp.gamesSharedCollection).toContainEqual(game);
      expect(comp.userProfilesSharedCollection).toContainEqual(userProfile);
      expect(comp.playerGame).toEqual(playerGame);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlayerGame>>();
      const playerGame = { id: 23206 };
      jest.spyOn(playerGameFormService, 'getPlayerGame').mockReturnValue(playerGame);
      jest.spyOn(playerGameService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playerGame });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: playerGame }));
      saveSubject.complete();

      // THEN
      expect(playerGameFormService.getPlayerGame).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(playerGameService.update).toHaveBeenCalledWith(expect.objectContaining(playerGame));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlayerGame>>();
      const playerGame = { id: 23206 };
      jest.spyOn(playerGameFormService, 'getPlayerGame').mockReturnValue({ id: null });
      jest.spyOn(playerGameService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playerGame: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: playerGame }));
      saveSubject.complete();

      // THEN
      expect(playerGameFormService.getPlayerGame).toHaveBeenCalled();
      expect(playerGameService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlayerGame>>();
      const playerGame = { id: 23206 };
      jest.spyOn(playerGameService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playerGame });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(playerGameService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGame', () => {
      it('Should forward to gameService', () => {
        const entity = { id: 7137 };
        const entity2 = { id: 5760 };
        jest.spyOn(gameService, 'compareGame');
        comp.compareGame(entity, entity2);
        expect(gameService.compareGame).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 22058 };
        const entity2 = { id: 9009 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
