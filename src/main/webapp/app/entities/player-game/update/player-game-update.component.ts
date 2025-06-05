import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGame } from 'app/entities/game/game.model';
import { GameService } from 'app/entities/game/service/game.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { PlayerGameService } from '../service/player-game.service';
import { IPlayerGame } from '../player-game.model';
import { PlayerGameFormGroup, PlayerGameFormService } from './player-game-form.service';

@Component({
  selector: 'jhi-player-game-update',
  templateUrl: './player-game-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PlayerGameUpdateComponent implements OnInit {
  isSaving = false;
  playerGame: IPlayerGame | null = null;

  gamesSharedCollection: IGame[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  protected playerGameService = inject(PlayerGameService);
  protected playerGameFormService = inject(PlayerGameFormService);
  protected gameService = inject(GameService);
  protected userProfileService = inject(UserProfileService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlayerGameFormGroup = this.playerGameFormService.createPlayerGameFormGroup();

  compareGame = (o1: IGame | null, o2: IGame | null): boolean => this.gameService.compareGame(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ playerGame }) => {
      this.playerGame = playerGame;
      if (playerGame) {
        this.updateForm(playerGame);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const playerGame = this.playerGameFormService.getPlayerGame(this.editForm);
    if (playerGame.id !== null) {
      this.subscribeToSaveResponse(this.playerGameService.update(playerGame));
    } else {
      this.subscribeToSaveResponse(this.playerGameService.create(playerGame));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlayerGame>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(playerGame: IPlayerGame): void {
    this.playerGame = playerGame;
    this.playerGameFormService.resetForm(this.editForm, playerGame);

    this.gamesSharedCollection = this.gameService.addGameToCollectionIfMissing<IGame>(this.gamesSharedCollection, playerGame.game);
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      playerGame.userProfile,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.gameService
      .query()
      .pipe(map((res: HttpResponse<IGame[]>) => res.body ?? []))
      .pipe(map((games: IGame[]) => this.gameService.addGameToCollectionIfMissing<IGame>(games, this.playerGame?.game)))
      .subscribe((games: IGame[]) => (this.gamesSharedCollection = games));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.playerGame?.userProfile),
        ),
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
