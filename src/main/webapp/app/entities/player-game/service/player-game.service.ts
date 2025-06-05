import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlayerGame, NewPlayerGame } from '../player-game.model';

export type PartialUpdatePlayerGame = Partial<IPlayerGame> & Pick<IPlayerGame, 'id'>;

export type EntityResponseType = HttpResponse<IPlayerGame>;
export type EntityArrayResponseType = HttpResponse<IPlayerGame[]>;

@Injectable({ providedIn: 'root' })
export class PlayerGameService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/player-games');

  create(playerGame: NewPlayerGame): Observable<EntityResponseType> {
    return this.http.post<IPlayerGame>(this.resourceUrl, playerGame, { observe: 'response' });
  }

  update(playerGame: IPlayerGame): Observable<EntityResponseType> {
    return this.http.put<IPlayerGame>(`${this.resourceUrl}/${this.getPlayerGameIdentifier(playerGame)}`, playerGame, {
      observe: 'response',
    });
  }

  partialUpdate(playerGame: PartialUpdatePlayerGame): Observable<EntityResponseType> {
    return this.http.patch<IPlayerGame>(`${this.resourceUrl}/${this.getPlayerGameIdentifier(playerGame)}`, playerGame, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlayerGame>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlayerGame[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlayerGameIdentifier(playerGame: Pick<IPlayerGame, 'id'>): number {
    return playerGame.id;
  }

  comparePlayerGame(o1: Pick<IPlayerGame, 'id'> | null, o2: Pick<IPlayerGame, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlayerGameIdentifier(o1) === this.getPlayerGameIdentifier(o2) : o1 === o2;
  }

  addPlayerGameToCollectionIfMissing<Type extends Pick<IPlayerGame, 'id'>>(
    playerGameCollection: Type[],
    ...playerGamesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const playerGames: Type[] = playerGamesToCheck.filter(isPresent);
    if (playerGames.length > 0) {
      const playerGameCollectionIdentifiers = playerGameCollection.map(playerGameItem => this.getPlayerGameIdentifier(playerGameItem));
      const playerGamesToAdd = playerGames.filter(playerGameItem => {
        const playerGameIdentifier = this.getPlayerGameIdentifier(playerGameItem);
        if (playerGameCollectionIdentifiers.includes(playerGameIdentifier)) {
          return false;
        }
        playerGameCollectionIdentifiers.push(playerGameIdentifier);
        return true;
      });
      return [...playerGamesToAdd, ...playerGameCollection];
    }
    return playerGameCollection;
  }
}
