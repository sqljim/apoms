import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/material-module';

import { TreatmentListService } from './treatment-list.service';

describe('TreatmentListService', () => {
  let service: TreatmentListService;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        MatSnackBar,
        Overlay,
        SnackbarService,
        TreatmentListService,
        { provide: FormBuilder, useValue: formBuilder }
    ]
    });

    service = TestBed.inject(TreatmentListService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
