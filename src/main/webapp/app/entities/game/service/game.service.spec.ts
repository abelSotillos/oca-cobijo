import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGame } from '../game.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../game.test-samples';

import { GameService } from './game.service';

const requireRestSample: IGame = {
  ...sampleWithRequiredData,
};

describe('Game Service', () => {
  let service: GameService;
  let httpMock: HttpTestingController;
  let expectedResult: IGame | IGame[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GameService);
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

    it('should create a Game', () => {
      const game = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(game).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Game', () => {
      const game = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(game).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Game', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Game', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Game', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGameToCollectionIfMissing', () => {
      it('should add a Game to an empty array', () => {
        const game: IGame = sampleWithRequiredData;
        expectedResult = service.addGameToCollectionIfMissing([], game);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(game);
      });

      it('should not add a Game to an array that contains it', () => {
        const game: IGame = sampleWithRequiredData;
        const gameCollection: IGame[] = [
          {
            ...game,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGameToCollectionIfMissing(gameCollection, game);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Game to an array that doesn't contain it", () => {
        const game: IGame = sampleWithRequiredData;
        const gameCollection: IGame[] = [sampleWithPartialData];
        expectedResult = service.addGameToCollectionIfMissing(gameCollection, game);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(game);
      });

      it('should add only unique Game to an array', () => {
        const gameArray: IGame[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gameCollection: IGame[] = [sampleWithRequiredData];
        expectedResult = service.addGameToCollectionIfMissing(gameCollection, ...gameArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const game: IGame = sampleWithRequiredData;
        const game2: IGame = sampleWithPartialData;
        expectedResult = service.addGameToCollectionIfMissing([], game, game2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(game);
        expect(expectedResult).toContain(game2);
      });

      it('should accept null and undefined values', () => {
        const game: IGame = sampleWithRequiredData;
        expectedResult = service.addGameToCollectionIfMissing([], null, game, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(game);
      });

      it('should return initial array if no Game is added', () => {
        const gameCollection: IGame[] = [sampleWithRequiredData];
        expectedResult = service.addGameToCollectionIfMissing(gameCollection, undefined, null);
        expect(expectedResult).toEqual(gameCollection);
      });
    });

    describe('compareGame', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGame(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 7137 };
        const entity2 = null;

        const compareResult1 = service.compareGame(entity1, entity2);
        const compareResult2 = service.compareGame(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 7137 };
        const entity2 = { id: 5760 };

        const compareResult1 = service.compareGame(entity1, entity2);
        const compareResult2 = service.compareGame(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 7137 };
        const entity2 = { id: 7137 };

        const compareResult1 = service.compareGame(entity1, entity2);
        const compareResult2 = service.compareGame(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
