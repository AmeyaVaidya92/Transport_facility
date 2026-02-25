import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  employeeId = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.employeeId.trim()) {
      alert('Please enter Employee ID');
      return;
    }
    const ok = this.auth.login(this.employeeId.trim());
    if (ok) {
      this.router.navigate(['/rides']);
    } else {
      alert('Invalid Employee ID');
    }
  }
}
