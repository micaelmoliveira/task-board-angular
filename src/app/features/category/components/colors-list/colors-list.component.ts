import { Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CategoryService } from '../../services/category.service';
import { categoryBackgroundColors } from '../../constants/category-colors';

const MODULES = [MatDivider];

@Component({
  selector: 'app-colors-list',
  standalone: true,
  imports: [...MODULES],
  templateUrl: './colors-list.component.html',
})
export class ColorsListComponent {
  private readonly categoryService = inject(CategoryService);

  public categories = this.categoryService.categories;

  public categoryBackgroundColors = categoryBackgroundColors;
}
