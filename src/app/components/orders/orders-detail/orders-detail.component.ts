import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ORDER_STATUS } from 'src/app/constants/order.constant';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {

  order?: any;
  user?: any;
  orderStatuses: any[] = [];
  selectedStatus: any;
  panelOpenState = false;

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loaderService.loading();
    this._mapOrderStatus();
    this._getOrder();
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      }
    });
  }

  private _getOrder() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.orderService.getOrder(params['id']).subscribe(order => {
          this.order = order;
          console.log('order: ', order)
          this.selectedStatus = order.status;
          console.log('user: ', this.order.user.id);
          this.userService.getUser(this.order.user.id).subscribe(user => {
            this.user = user;
            console.log('this.user: ', user)
          })
        });
      }
    });
  }

  onStatusChange(event: any) {
    // console.log('order: ', this.order.id);
    // console.log('order: ', event.value);
    this.orderService.updateOrder({ status: event.value }, this.order.id)
      .subscribe({
        next: () => {
          this.loaderService.loading();
          this.toastService.openSuccess('Order updated successfully');
        },
        error: () => {
          this.loaderService.loading();
          this.toastService.openError('Error while updating the order');
        }
      })
    //   this.orderService.updateOrder({ status: event.value }, this.order.id).subscribe(() => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Order has been updated!'
    //     });
    //   },
    //     () => {
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Error',
    //         detail: 'Failed to update an order!'
    //       });
    //     }
    //   );
  }

}
