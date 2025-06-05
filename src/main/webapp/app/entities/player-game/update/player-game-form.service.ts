import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPlayerGame, NewPlayerGame } from '../player-game.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlayerGame for edit and NewPlayerGameFormGroupInput for create.
 */
type PlayerGameFormGroupInput = IPlayerGame | PartialWithRequiredKeyOf<NewPlayerGame>;

type PlayerGameFormDefaults = Pick<NewPlayerGame, 'id' | 'isWinner'>;

type PlayerGameFormGroupContent = {
  id: FormControl<IPlayerGame['id'] | NewPlayerGame['id']>;
  positionx: FormControl<IPlayerGame['positionx']>;
  positiony: FormControl<IPlayerGame['positiony']>;
  order: FormControl<IPlayerGame['order']>;
  isWinner: FormControl<IPlayerGame['isWinner']>;
  game: FormControl<IPlayerGame['game']>;
  userProfile: FormControl<IPlayerGame['userProfile']>;
};

export type PlayerGameFormGroup = FormGroup<PlayerGameFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlayerGameFormService {
  createPlayerGameFormGroup(playerGame: PlayerGameFormGroupInput = { id: null }): PlayerGameFormGroup {
    const playerGameRawValue = {
      ...this.getFormDefaults(),
      ...playerGame,
    };
    return new FormGroup<PlayerGameFormGroupContent>({
      id: new FormControl(
        { value: playerGameRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      positionx: new FormControl(playerGameRawValue.positionx, {
        validators: [Validators.required],
      }),
      positiony: new FormControl(playerGameRawValue.positiony, {
        validators: [Validators.required],
      }),
      order: new FormControl(playerGameRawValue.order, {
        validators: [Validators.required],
      }),
      isWinner: new FormControl(playerGameRawValue.isWinner),
      game: new FormControl(playerGameRawValue.game),
      userProfile: new FormControl(playerGameRawValue.userProfile),
    });
  }

  getPlayerGame(form: PlayerGameFormGroup): IPlayerGame | NewPlayerGame {
    return form.getRawValue() as IPlayerGame | NewPlayerGame;
  }

  resetForm(form: PlayerGameFormGroup, playerGame: PlayerGameFormGroupInput): void {
    const playerGameRawValue = { ...this.getFormDefaults(), ...playerGame };
    form.reset(
      {
        ...playerGameRawValue,
        id: { value: playerGameRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PlayerGameFormDefaults {
    return {
      id: null,
      isWinner: false,
    };
  }
}
