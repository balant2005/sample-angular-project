import { 
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router'; 

import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';


@Component({   
  selector: 'app-sidebar',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})


export class Sidebar {


  @Input()
  collapsed = false;


  @Output()
  collapsedChange =
    new EventEmitter<boolean>();



  toggleSidebar() {

    this.collapsed =
      !this.collapsed;


    this.collapsedChange.emit(
      this.collapsed
    );

  }

}