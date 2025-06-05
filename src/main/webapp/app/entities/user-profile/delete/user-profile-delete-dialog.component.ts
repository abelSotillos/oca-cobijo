import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';

@Component({
  templateUrl: './user-profile-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserProfileDeleteDialogComponent {
  userProfile?: IUserProfile;

  protected userProfileService = inject(UserProfileService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userProfileService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
