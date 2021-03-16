import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material-module';

import { TeamVisitAssingerComponent } from './team-visit-assinger.component';

describe('TeamVisitAssingerComponent', () => {
  let component: TeamVisitAssingerComponent;
  let fixture: ComponentFixture<TeamVisitAssingerComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
                ReactiveFormsModule,
                MaterialModule,
                BrowserAnimationsModule
      ],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
      declarations: [ TeamVisitAssingerComponent ]
    })
    .compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(TeamVisitAssingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
