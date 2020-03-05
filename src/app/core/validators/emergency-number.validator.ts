import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CaseService } from 'src/app/pages/modules/emergency-register/services/case.service';

@Injectable({ providedIn: 'root' })
export class UniqueEmergencyNumberValidator {
  constructor(private caseService: CaseService) {}

  validate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.caseService.checkEmergencyNumberExists(control.value)
        .pipe(
          map(res => {
            // if username is already taken
            if (res[0]["@success"] == "1") {
              // return error
              return { 'emergencyNumberTaken': true};
            }
          })
        );
    };

  }

}
