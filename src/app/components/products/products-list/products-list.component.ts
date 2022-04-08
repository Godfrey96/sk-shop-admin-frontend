import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsFormComponent } from '../products-form/products-form.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy, AfterViewInit {

  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource!: MatTableDataSource<Product>;
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'image', 'category', 'countInStock', 'numReviews', 'price', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  ngAfterViewInit() {
  }

  // products: Product[] = [];
  endsub$: Subject<any> = new Subject();

  constructor(
    private productService: ProductService,
    private router: Router,
    public dialog: MatDialog,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
  ) {

  }

  ngOnInit(): void {
    this.loaderService.loading();
    this._getAllProducts()
  }

  private _getAllProducts() {
    this.productService.getAllProducts().pipe(
      takeUntil(this.endsub$)).subscribe((products) => {
        this.products = products;
        this.dataSource = new MatTableDataSource(this.products)
        this.dataSource.paginator = this.paginator;
        console.log('products: ', products);
      })
  }

  openDialog() {
    this.dialog.open(ProductsFormComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this._getAllProducts();
      }
    })
  }

  editProduct(element: any) {
    this.dialog.open(ProductsFormComponent, {
      width: '30%',
      data: element
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this._getAllProducts();
      }
    })
  }

  applyFilter(event: any) {
    console.log('event: ', event);
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProduct(id: string) {
    this.dialogService.openConfirmDialog('Are you sure to delete this product?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.productService.deleteProduct(id)
            .subscribe({
              next: (res) => {
                this.toastService.openSuccess('Product deleted successfully');
                // alert('Product deleted successfully');
                this._getAllProducts();
              },
              error: () => {
                this.toastService.openError('Error while deleting the product!');
                // alert('Error while deleting the product!');
              }
            })
        }
      });
  }

  ngOnDestroy() {
    this.endsub$.next('');
    this.endsub$.complete();
  }

}
