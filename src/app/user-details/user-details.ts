import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../services/user';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails implements OnInit, AfterViewInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(User);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('editor', { static: false })
  editorElement!: ElementRef<HTMLDivElement>;

  user: any = null;

  private editor: any;

  private viewInitialized = false;
  private userLoaded = false;

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    console.log('Route ID:', id);

    if (id) {

      this.userService.getUserById(id).subscribe({

        next: (data) => {

          console.log('User Details:', data);

          this.user = data;
          this.userLoaded = true;

          this.cdr.detectChanges();

          this.initializeEditor();

        },

        error: (err) => {

          console.error('User loading error:', err);

          this.user = null;
          this.userLoaded = false;

        }

      });

    }

  }

  ngAfterViewInit(): void {

    this.viewInitialized = true;

    this.initializeEditor();

  }

  private async initializeEditor(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.viewInitialized) {
      return;
    }

    if (!this.userLoaded) {
      return;
    }

    if (this.editor) {
      this.setEditorContent();
      return;
    }

    try {

      const aceModule: any =
        await import('ace-builds/src-noconflict/ace');

      const ace = aceModule.default || aceModule;

      await import('ace-builds/src-noconflict/mode-json');
      await import('ace-builds/src-noconflict/theme-chrome');

      this.editor = ace.edit(this.editorElement.nativeElement);

      this.editor.setTheme('ace/theme/chrome');

      this.editor.session.setMode('ace/mode/json');

      this.editor.setOptions({
        fontSize: '14px',
        showPrintMargin: false,
        highlightActiveLine: true,
        readOnly: true,
        wrap: true,
        showGutter: true
      });

      this.editor.setValue(
        JSON.stringify(this.user, null, 2),
        -1
      );

      console.log('Ace Editor initialized successfully');

    } catch (error) {

      console.error('Ace Editor initialization failed:', error);

    }

  }

  private setEditorContent(): void {

    if (!this.editor || !this.user) {
      return;
    }

    this.editor.setValue(
      JSON.stringify(this.user, null, 2),
      -1
    );

  }

  back(): void {

    this.router.navigate(['/users']);

  }

}