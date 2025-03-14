import { Component } from '@angular/core';
import { MainComponent } from './layout/main/main.component';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';

const COMPONENTS = [ThemeToggleComponent, MainComponent];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...COMPONENTS],
  templateUrl: './app.component.html',
  styles: ``,
})
export class AppComponent {}
