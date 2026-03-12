import { Component, OnInit } from '@angular/core';
import { ProductApi } from '../service/product-api';
import { Auth } from '../service/auth';
import { Cart } from '../service/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping',
  standalone: false,
  templateUrl: './shopping.html',
  styleUrl: './shopping.css',
})
export class Shopping implements OnInit {
  public products: any[] = [];
  public filteredProducts: any[] = [];
  public categories: any[] = [];
  public selectedCategory: string = '';
  public errMessage: string = '';
  public minPrice: number = 0;
  public maxPrice: number = 99999;
  public buyQuantity: { [key: string]: number } = {};

  constructor(
    private productService: ProductApi,
    public authService: Auth,
    private cartService: Cart,
    private router: Router
  ) {}

  ngOnInit() {
    // Q7: Load toàn bộ sản phẩm khi component khởi tạo
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // Khởi tạo số lượng mua mặc định = 1 cho mỗi sản phẩm
        data.forEach((p: any) => { this.buyQuantity[p._id] = 1; });
        this.onReset(); // Hiển thị tất cả sản phẩm khi trang vừa load
      },
      error: (err) => { this.errMessage = err.message; }
    });

    // Q9: Load danh sách Category cho dropdown
    this.productService.getCategories().subscribe({
      next: (data) => { this.categories = data; },
      error: (err) => { console.error('Error loading categories:', err); }
    });
  }

  // Q8: Tìm kiếm theo khoảng giá
  onSearch() {
    this.filteredProducts = this.products.filter(p => {
      const priceMatch = p.price >= this.minPrice && p.price <= this.maxPrice;
      const categoryMatch = !this.selectedCategory || p.categoryName === this.selectedCategory;
      return priceMatch && categoryMatch;
    });
  }

  // Q9: Lọc theo Category từ dropdown
  onCategoryChange() {
    this.onSearch();
  }

  // Reset bộ lọc
  onReset() {
    this.minPrice = 0;
    this.maxPrice = 99999;
    this.selectedCategory = '';
    this.filteredProducts = [...this.products];
  }

  // Q10: Thêm vào giỏ (chỉ Customer mới được mua)
  onBuy(product: any) {
    if (!this.authService.isLoggedIn()) {
      alert('Vui lòng đăng nhập với tài khoản Customer để mua hàng!');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.authService.isCustomer()) {
      alert('Chỉ Customer mới có thể mua hàng!');
      return;
    }
    const qty = this.buyQuantity[product._id] || 1;
    this.cartService.addToCart(product, qty);
    alert(`✅ Đã thêm "${product.productName}" (x${qty}) vào giỏ hàng!`);
  }

  // Trả về emoji dựa trên category
  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Electronics': '📱',
      'Sports': '🎾',
      'Books': '📚',
      'Clothing': '👕',
      'Food': '🍔',
      'Home': '🏠',
      'default': '📦'
    };
    return emojiMap[category] || emojiMap['default'];
  }

  // Lấy chữ cái đầu của tên sản phẩm
  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'P';
  }
}