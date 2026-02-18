import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart-service';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  cartService = inject(CartService);
private authService = inject(AuthService);
private router = inject(Router);

  
  userName = this.authService.currentUser;


  cartCount = computed(() => {
   
    return this.cartService.items().reduce((acc, item) => acc + item.quantity, 0);
  });
  onLogout() {
    this.authService.logout();
window.location.href = '/login';
   
  }

}