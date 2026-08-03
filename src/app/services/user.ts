import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class User {

  private http = inject(HttpClient);

  apiUrl = "http://localhost:3000/users";


  getUsers() {
    return this.http.get<any>(this.apiUrl);
  }


  getUserById(id: string) {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }


  addUser(user:any) {
    return this.http.post(this.apiUrl, user);
  }


  updateUser(id:string, user:any) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      user
    );
  }


  deleteUser(id:string) {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}