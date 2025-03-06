import { Component } from '@angular/core';
import { CategoryComponent } from '../../features/category/views/category/category.component';
import { MatDivider } from '@angular/material/divider';
import { TaskComponent } from '../../features/task/views/task/task.component';

const COMPONENTS = [CategoryComponent, TaskComponent];

const MODULES = [MatDivider];

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [...COMPONENTS, ...MODULES],
  templateUrl: './main.component.html',
  styles: ``,
})
export class MainComponent {}
