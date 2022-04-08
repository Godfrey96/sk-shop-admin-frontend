import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category/category.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CategoriesFormComponent } from '../categories-form/categories-form.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  dataSource!: MatTableDataSource<Category>;
  displayedColumns: string[] = ['name', 'image', 'actions'];
  categories: Category[] = [];
  endsub$: Subject<any> = new Subject();


  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    public dialog: MatDialog,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this.loaderService.loading();
    this._getCategories();
  }


  private _getCategories() {
    this.categoryService.getCategories().pipe(
      takeUntil(this.endsub$)).subscribe((categories) => {
        this.categories = categories;
        this.dataSource = new MatTableDataSource(this.categories)
        this.dataSource.paginator = this.paginator;
        console.log('categories: ', categories);
      })
  }

  openDialog() {
    this.dialog.open(CategoriesFormComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this._getCategories();
      }
    })
  }

  editCategory(element: any) {
    this.dialog.open(CategoriesFormComponent, {
      width: '30%',
      data: element
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this._getCategories();
      }
    })
  }

  applyFilter(event: any) {
    console.log('event: ', event);
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteCategory(id: string) {
    this.dialogService.openConfirmDialog('Are you sure to delete this category?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.categoryService.deleteCategory(id)
            .subscribe({
              next: (res) => {
                this.toastService.openSuccess('Category deleted successfully');
                // alert('Product deleted successfully');
                this._getCategories();
              },
              error: () => {
                this.toastService.openError('Error while deleting the category!');
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
