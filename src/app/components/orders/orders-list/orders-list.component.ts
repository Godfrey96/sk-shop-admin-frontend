import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ORDER_STATUS } from 'src/app/constants/order.constant';
import { Order } from 'src/app/models/order.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  dataSource!: MatTableDataSource<Order>;
  displayedColumns: string[] = ['user', 'totalPrice', 'dateOrdered', 'status', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  orders: Order[] = [];
  orderStatus = ORDER_STATUS;

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loaderService.loading();
    this._getOrders();
  }

  private _getOrders() {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.dataSource = new MatTableDataSource(this.orders)
      this.dataSource.paginator = this.paginator;
      console.log('orders: ', orders);
    });
  }

  editProduct(orderId: any) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  deleteProduct(id: string) {
    this.dialogService.openConfirmDialog('Are you sure to delete this order?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.orderService.deleteOrder(id)
            .subscribe({
              next: (res) => {
                this.toastService.openSuccess('Order deleted successfully');
                this._getOrders();
              },
              error: () => {
                this.toastService.openError('Error while deleting the order!');
              }
            })
        }
      });
  }

}
