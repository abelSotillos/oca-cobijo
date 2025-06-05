import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IGame, NewGame } from '../game.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGame for edit and NewGameFormGroupInput for create.
 */
type GameFormGroupInput = IGame | PartialWithRequiredKeyOf<NewGame>;

type GameFormDefaults = Pick<NewGame, 'id' | 'userProfiles'>;

type GameFormGroupContent = {
  id: FormControl<IGame['id'] | NewGame['id']>;
  code: FormControl<IGame['code']>;
  status: FormControl<IGame['status']>;
  currentTurn: FormControl<IGame['currentTurn']>;
  userProfiles: FormControl<IGame['userProfiles']>;
};

export type GameFormGroup = FormGroup<GameFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GameFormService {
  createGameFormGroup(game: GameFormGroupInput = { id: null }): GameFormGroup {
    const gameRawValue = {
      ...this.getFormDefaults(),
      ...game,
    };
    return new FormGroup<GameFormGroupContent>({
      id: new FormControl(
        { value: gameRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(gameRawValue.code, {
        validators: [Validators.required],
      }),
      status: new FormControl(gameRawValue.status, {
        validators: [Validators.required],
      }),
      currentTurn: new FormControl(gameRawValue.currentTurn),
      userProfiles: new FormControl(gameRawValue.userProfiles ?? []),
    });
  }

  getGame(form: GameFormGroup): IGame | NewGame {
    return form.getRawValue() as IGame | NewGame;
  }

  resetForm(form: GameFormGroup, game: GameFormGroupInput): void {
    const gameRawValue = { ...this.getFormDefaults(), ...game };
    form.reset(
      {
        ...gameRawValue,
        id: { value: gameRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GameFormDefaults {
    return {
      id: null,
      userProfiles: [],
    };
  }
}
