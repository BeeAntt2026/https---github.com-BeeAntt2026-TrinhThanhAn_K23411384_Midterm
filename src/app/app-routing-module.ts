import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shopping } from './shopping/shopping';
import { CurrentCart } from './current-cart/current-cart';
import { Revenue } from './revenue/revenue';
import { Login } from './login/login';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'shopping',       component: Shopping },
  { path: 'current-cart',   component: CurrentCart },
  { path: 'cart',           component: CurrentCart },
  { path: 'revenue',        component: Revenue },
  { path: 'login',          component: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
