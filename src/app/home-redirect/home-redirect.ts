import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-redirect',
  standalone: true,
  template: ''
})
export class HomeRedirect implements OnInit {

  constructor(
    private router: Router
  ) {}


  ngOnInit(): void {

    const token = localStorage.getItem(
      'token'
    );


    if (token) {

      this.router.navigate([
        '/dashboard'
      ]);

    }

    else {

      this.router.navigate([
        '/login'
      ]);

    }

  }

}