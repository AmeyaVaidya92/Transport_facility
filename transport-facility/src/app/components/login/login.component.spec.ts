import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize employeeId as empty string', () => {
    expect(component.employeeId).toBe('');
  });

  it('should show alert when employeeId is empty', () => {
    spyOn(window, 'alert');
    component.employeeId = '';
    component.login();
    expect(window.alert).toHaveBeenCalledWith('Please enter Employee ID');
  });

  it('should show alert when employeeId is only whitespace', () => {
    spyOn(window, 'alert');
    component.employeeId = '   ';
    component.login();
    expect(window.alert).toHaveBeenCalledWith('Please enter Employee ID');
  });

  it('should call auth.login with trimmed employeeId', () => {
    component.employeeId = '  EMP001  ';
    mockAuthService.login.and.returnValue(true);
    component.login();
    expect(mockAuthService.login).toHaveBeenCalledWith('EMP001');
  });

  it('should navigate to /rides on successful login', () => {
    component.employeeId = 'EMP001';
    mockAuthService.login.and.returnValue(true);
    component.login();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/rides']);
  });

  it('should show alert on failed login', () => {
    spyOn(window, 'alert');
    component.employeeId = 'INVALID';
    mockAuthService.login.and.returnValue(false);
    component.login();
    expect(window.alert).toHaveBeenCalledWith('Invalid Employee ID');
  });

  it('should not navigate when login fails', () => {
    component.employeeId = 'INVALID';
    mockAuthService.login.and.returnValue(false);
    component.login();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
