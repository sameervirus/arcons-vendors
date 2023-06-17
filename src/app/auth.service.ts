import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string; // Replace with your backend API URL
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  login(username: string, password: string): Observable<any> {
    const loginData = {
      username: username,
      password: password,
    };

    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  // Simulated logout function for demonstration purposes
  logout(): void {
    localStorage.clear();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token && token !== undefined && token != 'undefined') {
      this.isAuthenticated = true;
    }
    return this.isAuthenticated;
  }
}
