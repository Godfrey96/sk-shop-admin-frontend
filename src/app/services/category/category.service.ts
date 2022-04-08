import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiURLCategories = environment.apiURL + 'categories';

  constructor(
    private http: HttpClient
  ) { }

  // get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLCategories);
  }

  // get single category
  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`)
  }

  // add new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, category);
  }

  // update category
  updateCategory(category: Category, categoryId: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiURLCategories}/${categoryId}`, category);
  }

  // delete category
  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCategories}/${categoryId}`);
  }

}
