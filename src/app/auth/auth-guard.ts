import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = () => {

  const router = inject(Router);


  if (typeof window === 'undefined') {
    return true;
  }


  const token = localStorage.getItem(
    'token'
  );


  if (token) {

    return true;

  }


  return router.createUrlTree([
    '/login'
  ]);

};