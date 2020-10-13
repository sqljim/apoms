import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DropdownService } from 'src/app/core/services/dropdown/dropdown.service';
import { CrossFieldErrorMatcher } from 'src/app/core/validators/cross-field-error-matcher';

@Component({
    selector: 'cruelty-details',
    templateUrl: './cruelty-details.component.html',
    styleUrls: ['./cruelty-details.component.scss'],
})
export class CrueltyDetailsComponent implements OnInit {
    crueltyForm;
    crueltyInspectors$;

    errorMatcher = new CrossFieldErrorMatcher();

    crueltyDetails:FormGroup = new FormGroup({});

    constructor(private fb: FormBuilder, private dropdowns: DropdownService) {

        this.crueltyInspectors$ = this.dropdowns.getCrueltyInspectors();

        this.crueltyForm = this.fb.group({
            crueltyDetails: this.fb.group({
                crueltyReport: ['', Validators.required],
                postCrueltyReport: [''],
                crueltyInspector: [''],
            }),
        });

    }

    ngOnInit() {


        this.crueltyDetails = this.crueltyForm.get('crueltyDetails') as FormGroup;
    }
}
