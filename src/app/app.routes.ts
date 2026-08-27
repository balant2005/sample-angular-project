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

import { Policy } from './view/dashboard container/view/policy/policy';
import { EventMapper } from './view/dashboard container/view/event-mapper/event-mapper';

import { CreateComponent } from './view/dashboard container/view/policy/create/create';

import { PolicyDetailsComponent } from './view/dashboard container/view/policy/policy-details/policy-details';


export const routes: Routes = [

  // =========================================
  // HOME
  // =========================================

  {
    path: '',
    component: HomeRedirect
  },


  // =========================================
  // LOGIN
  // =========================================

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },


  // =========================================
  // MAIN LAYOUT
  // =========================================

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],

    children: [

      // DASHBOARD

      {
        path: 'dashboard',
        component: DashboardComponent
      },


      // USERS

      {
        path: 'users',
        component: Users
      },


      // USER DETAILS

      {
        path: 'user-details/:id',
        component: UserDetails
      },


      // REPORTS

      {
        path: 'reports',
        component: Reports
      },


      // EVENT MAPPER

      {
        path: 'event-mapper',
        component: EventMapper
      },


      // SETTINGS

      {
        path: 'settings',
        component: Settings
      },


      // THEME SETTINGS

      {
        path: 'theme-settings',
        component: ThemeSettings
      },


      // =========================================
      // POLICY LIST
      // /policy
      // =========================================

     {
  path: 'policy',
  component: Policy
},

{
  path: 'policy/create',
  component: CreateComponent
},

{
  path: 'policy/:id/edit',
  component: CreateComponent
},

{
  path: 'policy/:id',
  component: PolicyDetailsComponent
}
    ]

  },


  // =========================================
  // INVALID URL
  // =========================================

  {
    path: '**',
    redirectTo: ''
  }

];