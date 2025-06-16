import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGame, NewGame } from '../game.model';
import { IRollResult } from '../roll-result.model';

export type PartialUpdateGame = Partial<IGame> & Pick<IGame, 'id'>;

export type EntityResponseType = HttpResponse<IGame>;
export type EntityArrayResponseType = HttpResponse<IGame[]>;

@Injectable({ providedIn: 'root' })
export class GameService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/games');

  create(game: NewGame): Observable<EntityResponseType> {
    return this.http.post<IGame>(this.resourceUrl, game, { observe: 'response' });
  }

  update(game: IGame): Observable<EntityResponseType> {
    return this.http.put<IGame>(`${this.resourceUrl}/${this.getGameIdentifier(game)}`, game, { observe: 'response' });
  }

  partialUpdate(game: PartialUpdateGame): Observable<EntityResponseType> {
    return this.http.patch<IGame>(`${this.resourceUrl}/${this.getGameIdentifier(game)}`, game, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGame>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGame[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  createRoom(): Observable<EntityResponseType> {
    return this.http.post<IGame>(`${this.resourceUrl}/create-room`, {}, { observe: 'response' });
  }

  start(id: number): Observable<EntityResponseType> {
    return this.http.post<IGame>(`${this.resourceUrl}/${id}/start`, {}, { observe: 'response' });
  }

  roll(id: number): Observable<HttpResponse<IRollResult>> {
    return this.http.post<IRollResult>(`${this.resourceUrl}/${id}/roll`, {}, { observe: 'response' });
  }

  findByCode(code: string): Observable<EntityResponseType> {
    return this.http.get<IGame>(`${this.resourceUrl}/code/${code}`, { observe: 'response' });
  }

  findByUser(userId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IGame[]>(`${this.resourceUrl}/user/${userId}`, { observe: 'response' });
  }

  getGameIdentifier(game: Pick<IGame, 'id'>): number {
    return game.id;
  }

  compareGame(o1: Pick<IGame, 'id'> | null, o2: Pick<IGame, 'id'> | null): boolean {
    return o1 && o2 ? this.getGameIdentifier(o1) === this.getGameIdentifier(o2) : o1 === o2;
  }

  addGameToCollectionIfMissing<Type extends Pick<IGame, 'id'>>(
    gameCollection: Type[],
    ...gamesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const games: Type[] = gamesToCheck.filter(isPresent);
    if (games.length > 0) {
      const gameCollectionIdentifiers = gameCollection.map(gameItem => this.getGameIdentifier(gameItem));
      const gamesToAdd = games.filter(gameItem => {
        const gameIdentifier = this.getGameIdentifier(gameItem);
        if (gameCollectionIdentifiers.includes(gameIdentifier)) {
          return false;
        }
        gameCollectionIdentifiers.push(gameIdentifier);
        return true;
      });
      return [...gamesToAdd, ...gameCollection];
    }
    return gameCollection;
  }
}
