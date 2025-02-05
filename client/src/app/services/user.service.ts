import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/user'; // Adjusted to the correct base URL

  constructor(private http: HttpClient) {}

  // Get all users (already in your service)
  getUsers(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        throw error; 
      })
    );
  }

  // Register a new user
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      catchError((error) => {
        console.error('Error registering user:', error);
        throw error;
      })
    );
  }

  // Login an existing user
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError((error) => {
        console.error('Error logging in:', error);
        throw error;
      })
    );
  }
}
