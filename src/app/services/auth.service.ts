import { Injectable } from '@angular/core';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

import { Observable } from 'rxjs';

import { auth } from '../firebase';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  provider = new GoogleAuthProvider();


  // Email Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }


  // Create Account
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  }


  // Google Login
  googleLogin() {
    return signInWithPopup(
      auth,
      this.provider
    );
  }


  // Get Firebase JWT Token
  async getToken() {

    const user = auth.currentUser;

    if (user) {

      return await user.getIdToken();

    }

    throw new Error("User not found");

  }


  // Logout
  logout() {

    localStorage.removeItem("token");

    return signOut(auth);

  }


  // User Session
  getCurrentUser(): Observable<User | null> {

    return new Observable((observer) => {

      const unsubscribe = onAuthStateChanged(
        auth,
        (user: User | null) => {

          observer.next(user);

        }
      );

      return {
        unsubscribe
      };

    });

  }

}