import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class LogoService {
  private http = inject(HttpClient);
  private config = inject(ApplicationConfigService);

  private resourceUrl = this.config.getEndpointFor('api/logos');

  query(): Observable<string[]> {
    return this.http.get<string[]>(this.resourceUrl);
  }
}
