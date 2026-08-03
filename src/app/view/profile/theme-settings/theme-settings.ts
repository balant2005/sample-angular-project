import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './theme-settings.html',
  styleUrl: './theme-settings.css',
})
export class ThemeSettings implements OnInit {

  selectedTheme = '';

  themes = [

    {
      name: 'Blue',
      toolbar: '#3949ab',
      child: '#ffffff',
      sidebar: '#1f2937',
      highlight: '#e8eaf6'
    },

    {
      name: 'Green',
      toolbar: '#2e7d32',
      child: '#ffffff',
      sidebar: '#1b4332',
      highlight: '#e8f5e9'
    },

    {
      name: 'Orange',
      toolbar: '#ef6c00',
      child: '#ffffff',
      sidebar: '#5d4037',
      highlight: '#fff3e0'
    },

    {
      name: 'Purple',
      toolbar: '#7b1fa2',
      child: '#ffffff',
      sidebar: '#4a148c',
      highlight: '#f3e5f5'
    },

    {
      name: 'Red',
      toolbar: '#c62828',
      child: '#ffffff',
      sidebar: '#7f1d1d',
      highlight: '#ffebee'
    },

    {
      name: 'Dark',
      toolbar: '#212121',
      child: '#424242',
      sidebar: '#111827',
      highlight: '#616161'
    }

  ];

  toolbarColor =
    localStorage.getItem('toolbarColor') || '#3949ab';

  childToolbarColor =
    localStorage.getItem('childToolbarColor') || '#ffffff';

  sidebarColor =
    localStorage.getItem('sidebarColor') || '#1f2937';

  highlightColor =
    localStorage.getItem('highlightColor') || '#e8eaf6';

  ngOnInit(): void {

    this.selectedTheme =
      localStorage.getItem('selectedTheme') || '';

  }

 selectTheme(theme: any) {

  this.selectedTheme = theme.name;

  this.toolbarColor = theme.toolbar;
  this.childToolbarColor = theme.child;
  this.sidebarColor = theme.sidebar;
  this.highlightColor = theme.highlight;

  this.saveTheme();

}

  saveTheme() {

    localStorage.setItem(
      'selectedTheme',
      this.selectedTheme
    );

    localStorage.setItem(
      'toolbarColor',
      this.toolbarColor
    );

    localStorage.setItem(
      'childToolbarColor',
      this.childToolbarColor
    );

    localStorage.setItem(
      'sidebarColor',
      this.sidebarColor
    );

    localStorage.setItem(
      'highlightColor',
      this.highlightColor
    );

    document.documentElement.style.setProperty(
      '--toolbar-color',
      this.toolbarColor
    );

    document.documentElement.style.setProperty(
      '--child-toolbar-color',
      this.childToolbarColor
    );

    document.documentElement.style.setProperty(
      '--sidebar-color',
      this.sidebarColor
    );

    document.documentElement.style.setProperty(
      '--highlight-color',
      this.highlightColor
    );

    // Update the colors of the elements in the DOM
    const toolbar = document.querySelector('.toolbar') as HTMLElement;

  }
  resetTheme() {

    this.selectedTheme = 'Blue';
    this.toolbarColor = '#3949ab';   
    this.childToolbarColor = '#ffffff';
    this.sidebarColor = '#1f2937';
    this.highlightColor = '#e8eaf6';

    this.saveTheme();
  }

}