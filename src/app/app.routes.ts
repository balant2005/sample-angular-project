import { Routes } from '@angular/router';
import { HomeRedirect } from './home-redirect/home-redirect';
import { LoginComponent } from './view/view/login/login';
import { MainLayout } from './view/shared container/main-layout/main-layout';
import { loginGuard } from './auth/login-guard';
import { DashboardComponent } from './view/dashboard container/dashboard-component/dashboard-component';
import { Users } from './view/dashboard container/view/users/users';
import { UserDetails } from './user-details/user-details';
import { Reports } from './view/dashboard container/view/reports/reports';
import { Settings } from './view/dashboard container/view/settings/settings';
import { authGuard } from './auth/auth-guard';
import { ThemeSettings } from './view/profile/theme-settings/theme-settings'; 
import { EventMapper } from './view/dashboard container/view/event-mapper/event-mapper';
export const routes: Routes = [

  {
    path: '',
    component: HomeRedirect,
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'users',
        component: Users
      },

      {
        path: 'user-details/:id',
        component: UserDetails
      },

      {
        path: 'reports',
        component: Reports
      },
      {
    path: 'event-mapper',
    component: EventMapper
},
      {
  path: 'settings',
  component: Settings
},

{
  path: 'theme-settings',
  component: ThemeSettings
}

    ]

  },

  {
    path: '**',
    redirectTo: ''
  }

];