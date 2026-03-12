import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StudentInfo } from './student-info/student-info';
import { Login } from './login/login';
import { Navbar } from './navbar/navbar';
import { Shopping } from './shopping/shopping';
import { CurrentCart } from './current-cart/current-cart';
import { Revenue } from './revenue/revenue';

@NgModule({
  declarations: [
    App,
    StudentInfo,
    Login,
    Navbar,
    Shopping,
    CurrentCart,
    Revenue
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
