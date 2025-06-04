import { Route } from '@angular/router';

import PasswordResetFinishComponent from './password-reset-finish.component';

const passwordResetFinishRoute: Route = {
  path: 'reset/finish',
  component: PasswordResetFinishComponent,
  title: 'Contraseña',
};

export default passwordResetFinishRoute;
