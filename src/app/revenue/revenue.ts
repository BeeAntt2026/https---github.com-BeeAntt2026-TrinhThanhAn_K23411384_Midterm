import { Component, OnInit } from '@angular/core';
import { Auth } from '../service/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-revenue',
  standalone: false,
  templateUrl: './revenue.html',
  styleUrl: './revenue.css',
})
export class Revenue implements OnInit {
  private apiUrl = 'http://localhost:3004';
  public paidOrders: any[] = [];
  public filteredOrders: any[] = [];
  public totalRevenue: number = 0;
  public filterYear: string = '';
  public filterMonth: string = '';
  public years: string[] = [];
  public months: { value: string, label: string }[] = [
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' }
  ];

  constructor(public authService: Auth, private http: HttpClient) {}

  ngOnInit() {
    if (!this.authService.isEmployee()) return;
    this.fetchOrders();
    // Cập nhật liên tục mỗi 5s
    setInterval(() => {
      this.fetchOrders();
    }, 5000);
  }

  fetchOrders() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8');
    const options: Object = { headers: headers, responseType: 'text' };
    this.http.get<any>(`${this.apiUrl}/orders`, options).subscribe({
      next: (res: any) => {
        const allOrders = JSON.parse(res);
        this.paidOrders = allOrders.filter((o: any) => o.status === 'paid');
        this.applyFilter();
        // Tạo danh sách năm để lọc
        const yearSet = new Set(this.paidOrders.map((o: any) =>
          new Date(o.orderDate).getFullYear().toString()
        ));
        this.years = Array.from(yearSet).sort();
      }
    });
  }

  onFilterYear() {
    this.applyFilter();
  }

  onFilterMonth() {
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.paidOrders];
    
    // Filter by year
    if (this.filterYear) {
      result = result.filter(
        o => new Date(o.orderDate).getFullYear().toString() === this.filterYear
      );
    }
    
    // Filter by month
    if (this.filterMonth) {
      result = result.filter(
        o => (new Date(o.orderDate).getMonth() + 1).toString() === this.filterMonth
      );
    }
    
    this.filteredOrders = result;
    this.calcTotal(this.filteredOrders);
  }

  onReset() {
    this.filterYear = '';
    this.filterMonth = '';
    this.filteredOrders = [...this.paidOrders];
    this.calcTotal(this.filteredOrders);
  }

  calcTotal(orders: any[]) {
    this.totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }
}
