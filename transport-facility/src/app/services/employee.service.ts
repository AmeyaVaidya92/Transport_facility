/*
 * EmployeeService
 * keeps a list of valid employee IDs (loaded from assets with a fallback).
 * Code written by hand; straight forward and easy to follow.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: string[] = [];

  // fallback list to keep app usable if assets fail
  private fallback = ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005'];

  constructor(private http: HttpClient) {
    this.load();
  }

  private load() {
    this.http.get<string[]>('/assets/employees.json').subscribe({
      next: (list) => { this.employees = list || this.fallback; },
      error: () => { this.employees = this.fallback; }
    });
  }

  isValidEmployee(id: string): boolean {
    if (!id) { return false; }
    if (this.employees && this.employees.length) {
      return this.employees.includes(id.trim());
    }
    return this.fallback.includes(id.trim());
  }

  getAll(): string[] {
    return (this.employees && this.employees.length) ? this.employees : this.fallback;
  }
}
