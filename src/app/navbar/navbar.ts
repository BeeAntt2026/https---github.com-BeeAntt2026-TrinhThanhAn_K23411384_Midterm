import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../service/auth';
import { Cart } from '../service/cart';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public showCartMenu: boolean = false;

  constructor(
    public authService: Auth,
    public cartService: Cart,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/shopping']);
  }
}
