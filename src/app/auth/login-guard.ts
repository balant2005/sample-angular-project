import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = () => {

  const router = inject(Router);

  if (typeof window !== 'undefined') {

    const token = localStorage.getItem('token');

    if (token) {

      return router.createUrlTree(['/dashboard']);

    }

  }

  return true;
};