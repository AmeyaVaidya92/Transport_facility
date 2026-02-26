/*
 * Simple authentication helper
 * keeps track of the logged-in employee id in localStorage.
 * Written manually to keep things straightforward.
 */
import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';

const STORAGE_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private current: string | null = null;

  constructor(private emp: EmployeeService) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { this.current = saved; }
  }

  login(employeeId: string): boolean {
    const id = (employeeId || '').trim();
    if (!id) { return false; }
    if (!this.emp.isValidEmployee(id)) { return false; }
    this.current = id;
    localStorage.setItem(STORAGE_KEY, id);
    return true;
  }

  logout() {
    this.current = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): string | null {
    return this.current;
  }

  isLoggedIn(): boolean {
    return !!this.current;
  }
}
