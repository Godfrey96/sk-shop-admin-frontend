import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesFormComponent } from './components/categories/categories-form/categories-form.component';
import { CategoriesListComponent } from './components/categories/categories-list/categories-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersDetailComponent } from './components/orders/orders-detail/orders-detail.component';
import { OrdersListComponent } from './components/orders/orders-list/orders-list.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsFormComponent } from './components/products/products-form/products-form.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { ProductsComponent } from './components/products/products.component';
import { UsersFormComponent } from './components/users/users-form/users-form.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { DefaultComponent } from './layouts/default/default.component';
import { LoginComponent } from './layouts/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: DefaultComponent,
    canActivate: [AuthGuard],
    data: { isAdmin: true },
    children: [
      { path: '', component: DashboardComponent },
      // products
      { path: 'products', component: ProductsListComponent },
      { path: 'products', component: ProductsListComponent },
      { path: 'products/form', component: ProductsFormComponent },
      { path: 'products/form/:id', component: ProductsFormComponent },
      // categories
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories/form', component: CategoriesFormComponent },
      { path: 'categories/form/:id', component: CategoriesFormComponent },
      // users
      { path: 'users', component: UsersListComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'users/form', component: UsersFormComponent },
      { path: 'users/form/:id', component: UsersFormComponent },

      { path: 'orders', component: OrdersListComponent },
      { path: 'orders/:id', component: OrdersDetailComponent },
      // { path: 'users', component: UsersComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
