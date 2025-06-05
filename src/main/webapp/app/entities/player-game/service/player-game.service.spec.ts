import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPlayerGame } from '../player-game.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../player-game.test-samples';

import { PlayerGameService } from './player-game.service';

const requireRestSample: IPlayerGame = {
  ...sampleWithRequiredData,
};

describe('PlayerGame Service', () => {
  let service: PlayerGameService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlayerGame | IPlayerGame[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PlayerGameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a PlayerGame', () => {
      const playerGame = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(playerGame).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PlayerGame', () => {
      const playerGame = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(playerGame).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PlayerGame', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PlayerGame', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PlayerGame', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlayerGameToCollectionIfMissing', () => {
      it('should add a PlayerGame to an empty array', () => {
        const playerGame: IPlayerGame = sampleWithRequiredData;
        expectedResult = service.addPlayerGameToCollectionIfMissing([], playerGame);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(playerGame);
      });

      it('should not add a PlayerGame to an array that contains it', () => {
        const playerGame: IPlayerGame = sampleWithRequiredData;
        const playerGameCollection: IPlayerGame[] = [
          {
            ...playerGame,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlayerGameToCollectionIfMissing(playerGameCollection, playerGame);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PlayerGame to an array that doesn't contain it", () => {
        const playerGame: IPlayerGame = sampleWithRequiredData;
        const playerGameCollection: IPlayerGame[] = [sampleWithPartialData];
        expectedResult = service.addPlayerGameToCollectionIfMissing(playerGameCollection, playerGame);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(playerGame);
      });

      it('should add only unique PlayerGame to an array', () => {
        const playerGameArray: IPlayerGame[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const playerGameCollection: IPlayerGame[] = [sampleWithRequiredData];
        expectedResult = service.addPlayerGameToCollectionIfMissing(playerGameCollection, ...playerGameArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const playerGame: IPlayerGame = sampleWithRequiredData;
        const playerGame2: IPlayerGame = sampleWithPartialData;
        expectedResult = service.addPlayerGameToCollectionIfMissing([], playerGame, playerGame2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(playerGame);
        expect(expectedResult).toContain(playerGame2);
      });

      it('should accept null and undefined values', () => {
        const playerGame: IPlayerGame = sampleWithRequiredData;
        expectedResult = service.addPlayerGameToCollectionIfMissing([], null, playerGame, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(playerGame);
      });

      it('should return initial array if no PlayerGame is added', () => {
        const playerGameCollection: IPlayerGame[] = [sampleWithRequiredData];
        expectedResult = service.addPlayerGameToCollectionIfMissing(playerGameCollection, undefined, null);
        expect(expectedResult).toEqual(playerGameCollection);
      });
    });

    describe('comparePlayerGame', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlayerGame(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 23206 };
        const entity2 = null;

        const compareResult1 = service.comparePlayerGame(entity1, entity2);
        const compareResult2 = service.comparePlayerGame(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 23206 };
        const entity2 = { id: 10798 };

        const compareResult1 = service.comparePlayerGame(entity1, entity2);
        const compareResult2 = service.comparePlayerGame(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 23206 };
        const entity2 = { id: 23206 };

        const compareResult1 = service.comparePlayerGame(entity1, entity2);
        const compareResult2 = service.comparePlayerGame(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
