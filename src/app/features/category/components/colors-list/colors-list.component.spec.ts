import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsListComponent } from './colors-list.component';
import { provideHttpClient } from '@angular/common/http';

describe('ColorsListComponent', () => {
  let component: ColorsListComponent;
  let fixture: ComponentFixture<ColorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorsListComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
