import { Injectable } from '@angular/core';
import { CartItem } from '../model/cart-item';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private cartItems: CartItem[] = [];
  private storageKey = 'pandastore_cart';

  constructor() {
    // Load cart từ localStorage khi khởi tạo
    this.loadFromStorage();
  }

  // Load cart từ localStorage
  private loadFromStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.cartItems = parsed.map((item: any) => 
          new CartItem(item.product, item.quantity, item.subtotal)
        );
      } catch (e) {
        this.cartItems = [];
      }
    }
  }

  // Lưu cart vào localStorage
  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  // Thêm sản phẩm vào giỏ (Q10)
  addToCart(product: any, quantity: number = 1) {
    const existing = this.cartItems.find(item => item.product._id === product._id);
    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.quantity * existing.product.price;
    } else {
      const item = new CartItem(product, quantity, quantity * product.price);
      this.cartItems.push(item);
    }
    this.saveToStorage();
  }

  // Lấy toàn bộ giỏ hàng
  getCart(): CartItem[] {
    return this.cartItems;
  }

  // Tính tổng tiền
  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  // Đếm số lượng items trong giỏ
  getCartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Cập nhật số lượng (Q11)
  updateQuantity(productId: string, quantity: number) {
    const item = this.cartItems.find(i => i.product._id === productId);
    if (item) {
      item.quantity = quantity;
      item.subtotal = quantity * item.product.price;
      this.saveToStorage();
    }
  }

  // Xóa 1 sản phẩm khỏi giỏ (Q11)
  removeItem(productId: string) {
    this.cartItems = this.cartItems.filter(i => i.product._id !== productId);
    this.saveToStorage();
  }

  // Xóa toàn bộ giỏ (sau khi thanh toán – Q11)
  clearCart() {
    this.cartItems = [];
    this.saveToStorage();
  }
}
