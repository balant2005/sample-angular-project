import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar implements OnInit {

  private platformId = inject(PLATFORM_ID);

  darkMode = false;

  userEmail = 'User';
  initials = 'US';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const toolbarColor =
  localStorage.getItem('toolbarColor');

if(toolbarColor){

  document.documentElement.style
    .setProperty(
      '--toolbar-color',
      toolbarColor
    );

}

const childToolbarColor =
  localStorage.getItem('childToolbarColor');

if(childToolbarColor){

  document.documentElement.style
    .setProperty(
      '--child-toolbar-color',
      childToolbarColor
    );

}

const sidebarColor =
  localStorage.getItem('sidebarColor');

if(sidebarColor){

  document.documentElement.style
    .setProperty(
      '--sidebar-color',
      sidebarColor
    );

}

    if (isPlatformBrowser(this.platformId)) {

      this.userEmail =
        localStorage.getItem('userEmail') || 'User';


      this.initials =
        this.userEmail
          .substring(0, 2)
          .toUpperCase();


      const savedTheme =
        localStorage.getItem('theme');


      if (savedTheme === 'dark') {

        this.darkMode = true;

        document.body.classList.add(
          'dark-theme'
        );
      }

    }

  }


  toggleTheme() {

    this.darkMode = !this.darkMode;


    if (isPlatformBrowser(this.platformId)) {


      if (this.darkMode) {

        document.body.classList.add(
          'dark-theme'
        );

        localStorage.setItem(
          'theme',
          'dark'
        );

      } else {

        document.body.classList.remove(
          'dark-theme'
        );

        localStorage.setItem(
          'theme',
          'light'
        );

      }

    }

  }


  logout(): void {


    if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');

    }


    signOut(auth)
      .then(() => {

        this.router.navigate(['/login']);

      })
      .catch((error: unknown) => {

        console.log(error);

      });

  }

}