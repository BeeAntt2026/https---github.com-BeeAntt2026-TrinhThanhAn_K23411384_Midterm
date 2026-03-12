import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { Auth } from '../service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public email: string = '';
  public password: string = '';
  public loginType: string = 'customer';
  public errMessage: string = '';
  public isLoading: boolean = false;

  constructor(
    private authService: Auth, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  onLogin() {
    // Reset error message và kiểm tra đang loading
    this.errMessage = '';
    
    // Tránh click nhiều lần
    if (this.isLoading) {
      return;
    }
    
    // Validation
    if (!this.email || !this.email.trim()) {
      this.errMessage = 'Vui lòng nhập email!';
      this.cdr.detectChanges();
      return;
    }
    
    if (!this.password || !this.password.trim()) {
      this.errMessage = 'Vui lòng nhập mật khẩu!';
      this.cdr.detectChanges();
      return;
    }
    
    console.log('Login attempt:', this.email, this.loginType);
    this.isLoading = true;
    this.cdr.detectChanges();
    
    const loginObservable = this.loginType === 'customer' 
      ? this.authService.loginCustomer(this.email, this.password)
      : this.authService.loginEmployee(this.email, this.password);
    
    loginObservable.subscribe({
      next: (user) => {
        console.log('Login success:', user);
        this.isLoading = false;
        this.ngZone.run(() => {
          this.router.navigate(['/shopping']);
        });
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.errMessage = err.message || 'Đã xảy ra lỗi không xác định!';
        this.cdr.detectChanges();
      }
    });
  }
}
