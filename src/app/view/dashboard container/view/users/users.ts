import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../services/user';
import { CreateUser } from '../../../../create-user/create-user';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatSortModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit, AfterViewInit {
  private userService = inject(User);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  searchText = '';

  displayedColumns: string[] = [
    'sno',
    'name',
    'role',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<any>();
  allUsers: any[] = [];

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return (
        data.name.toLowerCase().includes(filter) ||
        data.role.toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter)
      );
    };

    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    // Wait a tick so layout is fully rendered before measuring
    setTimeout(() => this.setScrollHeight(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.setScrollHeight();
  }

  setScrollHeight() {
    if (!this.scrollContainer) return;

    const el = this.scrollContainer.nativeElement;
    const topOffset = el.getBoundingClientRect().top;
    const paginatorHeight = 56; // approx mat-paginator height
    const bottomPadding = 16;

    const availableHeight = window.innerHeight - topOffset - paginatorHeight - bottomPadding;

    el.style.height = availableHeight + 'px';
    el.style.maxHeight = availableHeight + 'px';
  }

 loadUsers() {
  this.userService.getUsers().subscribe({
    next: (data) => {
      this.allUsers = data;
      this.dataSource.data = data;

      // Reassign paginator AFTER data is set
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
    }
  });
}
  openCreateUser() {
    const dialogRef = this.dialog.open(CreateUser, {
      width: '400px',
      height: '100vh',
      position: {
        right: '0px',
        top: '0px'
      },
      panelClass: 'right-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result).subscribe(() => {
          this.loadUsers();
        });
      }
    });
  }

  searchUser() {
    const value = this.searchText.toLowerCase().trim();
    this.dataSource.filter = value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(user: any) {
    const dialogRef = this.dialog.open(CreateUser, {
      width: '400px',
      height: '100vh',
      position: {
        right: '0px',
        top: '0px'
      },
      panelClass: 'right-dialog',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe(() => {
          this.loadUsers();
          this.snackBar.open('User Updated Successfully', 'Close', {
            duration: 3000
          });
        });
      }
    });
  }

  viewUser(user: any) {
    this.router.navigate(['/user-details', user.id]);
  }

  deleteUser(id: string) {
    if (confirm('Delete User?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
        this.snackBar.open('User Deleted Successfully', 'Close', {
          duration: 3000
        });
      });
    }
  }
}