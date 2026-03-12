import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Backend API URL
  private apiUrl = 'http://localhost:3004';
  
  constructor(private _http: HttpClient) {}

  // Lưu thông tin user vào localStorage
  saveUser(user: any, role: string) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', user.customerName || user.employeeName);
  }

  // Lấy thông tin user hiện tại
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Lấy role: 'customer' hoặc 'employee'
  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  // Lấy tên để hiện "Welcome X"
  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  // Kiểm tra đã đăng nhập chưa
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Kiểm tra có phải Employee không (dùng cho Q12)
  isEmployee(): boolean {
    return this.getUserRole() === 'employee';
  }

  // Kiểm tra có phải Customer không (dùng cho Q10, Q11)
  isCustomer(): boolean {
    return this.getUserRole() === 'customer';
  }

  // Đăng xuất
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }

  // Đăng nhập Customer
  loginCustomer(email: string, password: string): Observable<any> {
    // Thêm headers chống cache để luôn lấy dữ liệu mới từ MongoDB
    const headers = new HttpHeaders()
      .set('Content-Type', 'text/plain;charset=utf-8')
      .set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('Expires', '0');
    const options: Object = { headers: headers, responseType: 'text' };
    
    // Thêm timestamp để tránh cache
    const timestamp = new Date().getTime();
    return this._http.get<any>(`${this.apiUrl}/customers?t=${timestamp}`, options).pipe(
      timeout(5000), // Timeout sau 5 giây
      map(res => {
        try {
          const customers = JSON.parse(res);
          console.log('Fetched customers from DB:', customers.length);
          const found = customers.find((c: any) => c.email === email && c.password === password);
          if (found) {
            this.saveUser(found, 'customer');
            return found;
          }
          throw new Error('Sai email hoặc mật khẩu');
        } catch (e: any) {
          if (e.message === 'Sai email hoặc mật khẩu') {
            throw e;
          }
          throw new Error('Lỗi xử lý dữ liệu từ server');
        }
      }),
      catchError(err => {
        console.error('Login Customer Error:', err);
        if (err.name === 'TimeoutError') {
          return throwError(() => new Error('Không thể kết nối tới server. Vui lòng kiểm tra lại!'));
        }
        if (err.status === 0) {
          return throwError(() => new Error('Không thể kết nối tới database. Vui lòng kiểm tra server!'));
        }
        if (err.status === 404) {
          return throwError(() => new Error('API không tồn tại'));
        }
        if (err.message) {
          return throwError(() => err);
        }
        return throwError(() => new Error('Đã xảy ra lỗi. Vui lòng thử lại!'));
      })
    );
  }

  // Đăng nhập Employee
  loginEmployee(email: string, password: string): Observable<any> {
    // Thêm headers chống cache để luôn lấy dữ liệu mới từ MongoDB
    const headers = new HttpHeaders()
      .set('Content-Type', 'text/plain;charset=utf-8')
      .set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('Expires', '0');
    const options: Object = { headers: headers, responseType: 'text' };
    
    // Thêm timestamp để tránh cache
    const timestamp = new Date().getTime();
    return this._http.get<any>(`${this.apiUrl}/employees?t=${timestamp}`, options).pipe(
      timeout(5000), // Timeout sau 5 giây
      map(res => {
        try {
          const employees = JSON.parse(res);
          console.log('Fetched employees from DB:', employees.length);
          const found = employees.find((e: any) => e.email === email && e.password === password);
          if (found) {
            this.saveUser(found, 'employee');
            return found;
          }
          throw new Error('Sai email hoặc mật khẩu');
        } catch (e: any) {
          if (e.message === 'Sai email hoặc mật khẩu') {
            throw e;
          }
          throw new Error('Lỗi xử lý dữ liệu từ server');
        }
      }),
      catchError(err => {
        console.error('Login Employee Error:', err);
        if (err.name === 'TimeoutError') {
          return throwError(() => new Error('Không thể kết nối tới server. Vui lòng kiểm tra lại!'));
        }
        if (err.status === 0) {
          return throwError(() => new Error('Không thể kết nối tới database. Vui lòng kiểm tra server!'));
        }
        if (err.status === 404) {
          return throwError(() => new Error('API không tồn tại'));
        }
        if (err.message) {
          return throwError(() => err);
        }
        return throwError(() => new Error('Đã xảy ra lỗi. Vui lòng thử lại!'));
      })
    );
  }
}
