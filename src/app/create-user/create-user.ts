import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {

pageSize = 10;
  private dialogRef = inject(MatDialogRef<CreateUser>);
  data: any = inject(MAT_DIALOG_DATA);

  isEdit = false;

  user = {
    name: '',
    role: '',
    status: 'Active'
  };

  constructor() {

    if (this.data) {

      this.isEdit = true;

      this.user = {
        name: this.data.name,
        role: this.data.role,
        status: this.data.status
      };

    }

  }

  save() {
    this.dialogRef.close(this.user);
  }

  close() {
    this.dialogRef.close();
  }

}