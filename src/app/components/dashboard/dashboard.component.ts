import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  usersCount = 0;
  ordersCount = 0;
  productsCount = 0;
  totalSalesCount = 0;

  constructor(
    private loaderService: LoaderService,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loaderService.loading();
    this._getUsersCount();
    this._getOrdersCount();
    this._getProductsCount();
    this._getTotalSalesCount();
  }

  private _getUsersCount() {
    this.userService.getUsersCount().subscribe((users) => {
      this.usersCount = users
    })
  }
  private _getOrdersCount() {
    this.orderService.getOrdersCount().subscribe((orders) => {
      this.ordersCount = orders
    })
  }
  private _getProductsCount() {
    this.productService.getProductsCount().subscribe((products) => {
      this.productsCount = products
    })
  }
  private _getTotalSalesCount() {
    this.orderService.getTotalSales().subscribe((totalSales) => {
      this.totalSalesCount = totalSales
    })
  }

}
