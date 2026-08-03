import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../services/auth.service';
import { auth } from '../../../firebase';
@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginComponent implements OnInit {

  email = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  isSignup = false;


  constructor(
    private router: Router,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
  }


  // Email Login
  login(): void {

  this.authService
    .login(this.email, this.password)

    .then(async () => {

      const token =
        await this.authService.getToken();


      localStorage.setItem(
        "token",
        token
      );
      localStorage.setItem(
  "userEmail",
  this.email
);


      alert("Login Successful");


      this.router.navigate([
        '/dashboard'
      ]);

    })

    .catch((error: any) => {

      alert(error.message);

    });

}


  // Create Account
  register(): void {

    if (this.password !== this.confirmPassword) {

      alert("Passwords do not match");

      return;

    }


    this.authService
      .register(this.email, this.password)

      .then(() => {

        alert("Account Created Successfully");

        this.isSignup = false;

        this.email = '';
        this.password = '';
        this.confirmPassword = '';

        this.showPassword = false;
        this.showConfirmPassword = false;

      })

      .catch((error: any) => {

        alert(error.message);

      });

  }


  // Google Login
  googleLogin(): void {


  this.authService
    .googleLogin()

    .then(async () => {


      const token =
        await this.authService.getToken();


      localStorage.setItem(
        "token",
        token
      );
     const email =
  auth.currentUser?.email || "User";

localStorage.setItem(
  "userEmail",
  email
);

      this.router.navigate([
        '/dashboard'
      ]);


    })

    .catch((error: any) => {

      alert(error.message);

    });

}}