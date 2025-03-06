import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Category } from '../model/category.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _apiUrl = environment.apiUrl;

  private readonly httpClient = inject(HttpClient);

  public categories = signal<Category[]>([]);

  public getCategories(): Observable<Category[]> {
    return this.httpClient
      .get<Category[]>(`${this._apiUrl}/categories`)
      .pipe(tap(categories => this.categories.set(categories)));
  }
}
