import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { Sidebar } from '../sidebar/sidebar';
import { Toolbar } from '../toolbar/toolbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    Toolbar,
    Sidebar,
    RouterOutlet
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

  private readonly router = inject(Router);

  // Sidebar
  sidebarCollapsed = false;

  // Child toolbar title
  pageTitle = 'Dashboard';


  constructor() {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        const url = this.router.url;


        if (url.includes('dashboard')) {
          this.pageTitle = 'Dashboard';
        }

        else if (url.includes('users')) {
          this.pageTitle = 'Users';
        }

        else if (url.includes('reports')) {
          this.pageTitle = 'Reports';
        }

        else if (url.includes('settings')) {
          this.pageTitle = 'Settings';
        }
            else if (url.includes('event-mapper')) {
              this.pageTitle = 'Event Mapper';
            }
            else if (url.includes('policy')) {
              this.pageTitle = 'Policy';
            }
            else if (url.includes('create')) {
              this.pageTitle = 'Create Policy Page';
            }

        else {
          this.pageTitle = '';
        }
      });

  }


  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

}