import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Category } from '../model/category.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly _apiUrl = environment.apiUrl;

  private readonly httpClient = inject(HttpClient);

  private categories$ = this.httpClient.get<Category[]>(
    `${this._apiUrl}/categories`
  );

  public categories = toSignal(this.categories$, {
    initialValue: [] as Category[],
  });
}
