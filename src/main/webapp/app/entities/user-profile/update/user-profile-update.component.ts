import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGame } from 'app/entities/game/game.model';
import { GameService } from 'app/entities/game/service/game.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { UserProfileService } from '../service/user-profile.service';
import { LogoService } from '../service/logo.service';
import { IUserProfile } from '../user-profile.model';
import { UserProfileFormGroup, UserProfileFormService } from './user-profile-form.service';

@Component({
  selector: 'jhi-user-profile-update',
  templateUrl: './user-profile-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserProfileUpdateComponent implements OnInit {
  isSaving = false;
  userProfile: IUserProfile | null = null;

  gamesSharedCollection: IGame[] = [];
  usersSharedCollection: IUser[] = [];
  logos: string[] = [];

  protected userProfileService = inject(UserProfileService);
  protected userProfileFormService = inject(UserProfileFormService);
  protected gameService = inject(GameService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);
  protected logoService = inject(LogoService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UserProfileFormGroup = this.userProfileFormService.createUserProfileFormGroup();

  compareGame = (o1: IGame | null, o2: IGame | null): boolean => this.gameService.compareGame(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.userProfile = userProfile;
      if (userProfile) {
        this.updateForm(userProfile);
      }

      this.loadRelationshipsOptions();
    });
    this.logoService.query().subscribe(logos => (this.logos = logos));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userProfile = this.userProfileFormService.getUserProfile(this.editForm);
    if (userProfile.id !== null) {
      this.subscribeToSaveResponse(this.userProfileService.update(userProfile));
    } else {
      this.subscribeToSaveResponse(this.userProfileService.create(userProfile));
    }
  }

  selectLogo(logo: string): void {
    this.editForm.get('avatarUrl')?.setValue(logo);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserProfile>>): void {
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

  protected updateForm(userProfile: IUserProfile): void {
    this.userProfile = userProfile;
    this.userProfileFormService.resetForm(this.editForm, userProfile);

    this.gamesSharedCollection = this.gameService.addGameToCollectionIfMissing<IGame>(
      this.gamesSharedCollection,
      ...(userProfile.games ?? []),
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userProfile.user);
  }

  protected loadRelationshipsOptions(): void {
    this.gameService
      .query()
      .pipe(map((res: HttpResponse<IGame[]>) => res.body ?? []))
      .pipe(map((games: IGame[]) => this.gameService.addGameToCollectionIfMissing<IGame>(games, ...(this.userProfile?.games ?? []))))
      .subscribe((games: IGame[]) => (this.gamesSharedCollection = games));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userProfile?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
