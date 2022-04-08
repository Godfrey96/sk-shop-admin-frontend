import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import 'firebase/firestore';
import { finalize } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Product } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductService } from 'src/app/services/product/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {

  productForm!: FormGroup;
  isSubmitted = false;
  editmode = false;
  actionBtn: string = 'Save';
  titleForm: string = 'Add';
  categories: Category[] = [];
  imageDisplay: any;
  currentProductId!: string;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private afStorage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<ProductsFormComponent>,
    private toastService: ToastService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this._initProductForm();
    this._getCategories();
    this._checkEditMode();
  }

  private _initProductForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      isFeatured: [false],
      isBestSeller: [false],
      image: ['', Validators.required],
    })
  }

  private _getCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log('categories: ', categories);
    })
  }

  private _checkEditMode() {
    if (this.editData) {
      this.actionBtn = 'Update';
      this.titleForm = 'Update';
      this.productFormError['name'].setValue(this.editData.name);
      this.productFormError['description'].setValue(this.editData.description);
      this.productFormError['price'].setValue(this.editData.price);
      this.productFormError['category'].setValue(this.editData.category?.id);
      this.productFormError['countInStock'].setValue(this.editData.countInStock);
      this.productFormError['isFeatured'].setValue(this.editData.isFeatured);
      this.productFormError['isBestSeller'].setValue(this.editData.isBestSeller);
      this.imageDisplay = this.editData.image;
      this.productFormError['image'].setValidators([]);
      this.productFormError['image'].updateValueAndValidity();
    }
  }

  onImageUpload(event: any) {
    console.log(event);
    const files = event.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) === null) return;
    const file = files[0];
    const filePath = 'sk-ecommerce/' + Date.now() + '_' + file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    task.snapshotChanges().pipe(
      finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe((url: any) => {
          console.log('url: ', url);
          if (url) {
            this.imageDisplay = url;
          }
        });
      })
    ).subscribe(url => {
      console.log('data: ', url);
    });
  }

  createProduct(product: Product) {
    this.productService.createProduct(product)
      .subscribe({
        next: (res) => {
          this.loaderService.loading();
          this.toastService.openSuccess('Product added successfully');
          this.productForm.reset();
          this.dialogRef.close('save');
        },
        error: () => {
          this.loaderService.loading();
          this.toastService.openError('Error while adding the product');
        }
      })
  }

  updateProduct(product: Product) {
    this.productService.updateProduct(product, this.editData.id)
      .subscribe({
        next: (res) => {
          this.loaderService.loading();
          this.toastService.openSuccess('Product updated successfully');
          this.productForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          this.loaderService.loading();
          this.toastService.openError('Error while updating the product');
        }
      })
  }

  addProduct() {
    this.isSubmitted = true;

    const product: Product = {
      // id: this.editData.id,
      name: this.productFormError['name'].value,
      description: this.productFormError['description'].value,
      price: this.productFormError['price'].value,
      countInStock: this.productFormError['countInStock'].value,
      category: this.productFormError['category'].value,
      image: this.imageDisplay,
      isFeatured: this.productFormError['isFeatured'].value,
      isBestSeller: this.productFormError['isBestSeller'].value,
    }

    if (this.editData) {
      this.updateProduct(product);
    } else {
      this.createProduct(product);
    }

  }

  onCancle() {
    this.dialogRef.close();
  }

  // errors
  get productFormError() {
    return this.productForm.controls;
  }

}
