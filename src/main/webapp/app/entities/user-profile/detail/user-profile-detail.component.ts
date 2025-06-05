import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IUserProfile } from '../user-profile.model';

@Component({
  selector: 'jhi-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class UserProfileDetailComponent {
  userProfile = input<IUserProfile | null>(null);

  previousState(): void {
    window.history.back();
  }
}
