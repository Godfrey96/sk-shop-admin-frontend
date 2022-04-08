import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category/category.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { finalize } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  categoryForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  editmode = false;
  actionBtn: string = 'Save';
  titleForm: string = "Add"
  // imageDisplay: string | ArrayBuffer | undefined;
  imageDisplay: any;
  currentCategoryId!: string;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private afStorage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<CategoriesFormComponent>,
    private toastService: ToastService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this._initCategoryForm();
    this.checkEditMode();
  }

  // form
  _initCategoryForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  // check edit mode
  private checkEditMode() {
    if (this.editData) {
      this.actionBtn = 'Update';
      this.titleForm = 'Update';
      this.categoryFormError['name'].setValue(this.editData.name);
      this.imageDisplay = this.editData.image;
      this.categoryFormError['image'].setValidators([]);
      this.categoryFormError['image'].updateValueAndValidity();
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

  createCategory(category: Category) {
    this.categoryService.createCategory(category)
      .subscribe({
        next: (res) => {
          this.loaderService.loading();
          this.toastService.openSuccess('Category added successfully');
          this.categoryForm.reset();
          this.dialogRef.close('save');
        },
        error: () => {
          this.loaderService.loading();
          this.toastService.openError('Error while adding the category');
        }
      })
  }

  updateCategory(category: Category) {
    this.categoryService.updateCategory(category, this.editData.id)
      .subscribe({
        next: (res) => {
          this.loaderService.loading();
          this.toastService.openSuccess('Category updated successfully');
          this.categoryForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          this.loaderService.loading();
          this.toastService.openError('Error while updating the category');
        }
      })
  }

  addCategory() {
    this.isSubmitted = true;

    const category: Category = {
      // id: this.currentCategoryId,
      name: this.categoryFormError['name'].value,
      image: this.imageDisplay
    }

    if (this.editData) {
      this.updateCategory(category);
    } else {
      this.createCategory(category);
    }


  }

  onCancle() {
    this.dialogRef.close();
  }

  // errors
  get categoryFormError() {
    return this.categoryForm.controls;
  }

}
