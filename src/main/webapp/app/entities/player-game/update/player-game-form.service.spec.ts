import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../player-game.test-samples';

import { PlayerGameFormService } from './player-game-form.service';

describe('PlayerGame Form Service', () => {
  let service: PlayerGameFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerGameFormService);
  });

  describe('Service methods', () => {
    describe('createPlayerGameFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlayerGameFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            positionx: expect.any(Object),
            positiony: expect.any(Object),
            order: expect.any(Object),
            isWinner: expect.any(Object),
            game: expect.any(Object),
            userProfile: expect.any(Object),
          }),
        );
      });

      it('passing IPlayerGame should create a new form with FormGroup', () => {
        const formGroup = service.createPlayerGameFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            positionx: expect.any(Object),
            positiony: expect.any(Object),
            order: expect.any(Object),
            isWinner: expect.any(Object),
            game: expect.any(Object),
            userProfile: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlayerGame', () => {
      it('should return NewPlayerGame for default PlayerGame initial value', () => {
        const formGroup = service.createPlayerGameFormGroup(sampleWithNewData);

        const playerGame = service.getPlayerGame(formGroup) as any;

        expect(playerGame).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlayerGame for empty PlayerGame initial value', () => {
        const formGroup = service.createPlayerGameFormGroup();

        const playerGame = service.getPlayerGame(formGroup) as any;

        expect(playerGame).toMatchObject({});
      });

      it('should return IPlayerGame', () => {
        const formGroup = service.createPlayerGameFormGroup(sampleWithRequiredData);

        const playerGame = service.getPlayerGame(formGroup) as any;

        expect(playerGame).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlayerGame should not enable id FormControl', () => {
        const formGroup = service.createPlayerGameFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlayerGame should disable id FormControl', () => {
        const formGroup = service.createPlayerGameFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
