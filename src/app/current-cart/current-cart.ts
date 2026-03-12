import { Component } from '@angular/core';
import { Cart } from '../service/cart';
import { Auth } from '../service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-cart',
  standalone: false,
  templateUrl: './current-cart.html',
  styleUrl: './current-cart.css',
})
export class CurrentCart {
  public paymentDone: boolean = false;

  constructor(
    public cartService: Cart,
    public authService: Auth,
    private router: Router
  ) {}

  // Q10: Cập nhật số lượng từ input
  onUpdateQty(productId: string, event: any) {
    const qty = parseInt(event.target.value);
    if (qty > 0) {
      this.cartService.updateQuantity(productId, qty);
    }
  }

  // Q10: Tăng số lượng
  onIncrease(productId: string) {
    const cart = this.cartService.getCart();
    const item = cart.find(i => i.product._id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  // Q10: Giảm số lượng
  onDecrease(productId: string) {
    const cart = this.cartService.getCart();
    const item = cart.find(i => i.product._id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  // Q10: Xóa 1 sản phẩm
  onRemove(productId: string) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      this.cartService.removeItem(productId);
    }
  }

  // Q11: Thanh toán
  onCheckout() {
    if (!this.authService.isCustomer()) {
      alert('Chỉ Customer mới có thể thanh toán!');
      this.router.navigate(['/login']);
      return;
    }
    const total = this.cartService.getTotal();
    if (confirm(`Xác nhận thanh toán $${total.toFixed(2)}?`)) {
      // Tạo đơn hàng mới
      const order = {
        customerName: this.authService.getUserName(),
        orderDate: new Date().toISOString(),
        totalAmount: total,
        status: 'paid',
        paymentMethod: 'online',
        items: this.cartService.getCart().map(i => ({
          productId: i.product._id,
          productName: i.product.productName,
          quantity: i.quantity,
          price: i.product.price
        }))
      };
      // Gọi API lưu đơn hàng
      fetch('http://localhost:3004/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      }).then(res => res.json()).then(() => {
        this.cartService.clearCart();
        this.paymentDone = true;
        alert('Đã thanh toán và lưu đơn hàng thành công!');
      }).catch(() => {
        alert('Lỗi khi lưu đơn hàng!');
      });
    }
  }
}
