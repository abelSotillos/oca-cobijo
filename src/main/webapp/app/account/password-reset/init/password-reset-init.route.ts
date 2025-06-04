import { Route } from '@angular/router';

import PasswordResetInitComponent from './password-reset-init.component';

const passwordResetInitRoute: Route = {
  path: 'reset/request',
  component: PasswordResetInitComponent,
  title: 'Contraseña',
};

export default passwordResetInitRoute;
