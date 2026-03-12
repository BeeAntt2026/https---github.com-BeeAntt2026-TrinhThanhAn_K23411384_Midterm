import { Component, signal, OnInit } from '@angular/core';
import { Auth } from './service/auth';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('my-app');
  public loggedInUser: any = null;

  constructor(
    private authService: Auth,
    private router: Router
  ) {
    // Refresh loggedInUser mỗi khi navigate (để cập nhật sau login)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loggedInUser = this.authService.getCurrentUser();
    });
  }

  ngOnInit() {
    // Lấy thông tin user đã đăng nhập từ localStorage
    this.loggedInUser = this.authService.getCurrentUser();
  }

  // Kiểm tra có phải Employee không
  isEmployee(): boolean {
    return this.authService.isEmployee();
  }

  // Kiểm tra có phải Customer không
  isCustomer(): boolean {
    return this.authService.isCustomer();
  }

  // Kiểm tra đã đăng nhập chưa
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Đăng xuất
  logout() {
    this.authService.logout();
    this.loggedInUser = null;
    this.router.navigate(['/login']);
  }
}
