import { trigger, state, style, transition, animate } from '@angular/animations';

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from '../../services/navigation/navigation.service';
import { Search, SearchValue } from '../record-search/record-search.component';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  animations: [
    trigger('expandSearchForm', [
        state(
            'void',
            style({
                display: 'none',
                height: '0px',
            }),
        ),
        state(
            'open',
            style({
                width: '97%',
            }),
        ),
        state(
            'closed',
            style({
                display: 'none',
                height: '0px',
            }),
        ),
        transition('open <=> closed', [animate('.2s')]),
    ]),
]
})
export class SearchFieldComponent implements OnInit {

  searchFieldForm = new FormControl();

    @Output() public searchString = new EventEmitter<string>();
    @ViewChild('searchBox') searchBox!:ElementRef;
    searchForm: FormGroup = new FormGroup({});
    searchRows: FormArray = new FormArray([]);

    searchShowing = false;

    search = new Search();

    options: SearchValue[] = [
        {
            id: 0,
            inputType: 'text',
            searchValue: undefined,
            databaseField: undefined,
            name: undefined,
            inNotIn: false
        },
        {
            id: 1,
            inputType: 'text',
            searchValue: 'emno',
            databaseField: 'search.EmergencyNumber',
            name: 'Em. no.',
            inNotIn: false
        },
        {
            id: 2,
            inputType: 'date',
            searchValue: 'calldate',
            databaseField: 'CAST(search.CallDateTime AS DATE)',
            name: 'Call Date',
            inNotIn: false
        },
        {
            id: 3,
            inputType: 'text',
            searchValue: 'tagno',
            databaseField: 'search.TagNumber',
            name: 'Tag no.',
            inNotIn: false
        },
        {
            id: 4,
            inputType: 'text',
            searchValue: 'cname',
            databaseField: 'search.EmergencyCaseId IN (SELECT DISTINCT ec.EmergencyCaseId FROM Caller c ' +
            'INNER JOIN AAU.EmergencyCaller ecr ON ecr.CallerId ~~ c.CallerId ' +
            'INNER JOIN AAU.EmergencyCase ec ON ec.EmergencyCaseId ~~ ecr.EmergencyCaseId ' +
            // 'WHERE c.Name =',
            'WHERE ecr.IsDeleted ~~ 0 AND c.Name =',
            name: 'Caller name',
            inNotIn: true
        },
        {
            id: 5,
            inputType: 'text',
            searchValue: 'cnumber',
            databaseField:  'search.EmergencyCaseId IN (SELECT DISTINCT ec.EmergencyCaseId FROM Caller c ' +
            'INNER JOIN AAU.EmergencyCaller ecr ON ecr.CallerId ~~ c.CallerId ' +
            'INNER JOIN AAU.EmergencyCase ec ON ec.EmergencyCaseId ~~ ecr.EmergencyCaseId ' +
            // 'WHERE c.Number =',
            'WHERE ecr.IsDeleted ~~ 0 AND c.Number =',
            name: 'Caller no.',
            inNotIn: true
        },
        {
            id: 6,
            inputType: 'text',
            searchValue: 'location',
            databaseField: 'search.Location',
            name: 'Location',
            inNotIn: false
        },
        {
            id: 8,
            inputType: 'text',
            searchValue: 'species',
            databaseField: 'search.AnimalType',
            name: 'Animal type',
            inNotIn: false
        },
        {
            id: 9,
            inputType: 'text',
            searchValue: 'problem',
            databaseField: 'search.Problem',
            name: 'Problem',
            inNotIn: false
        },
        {
            id: 10,
            inputType: 'text',
            searchValue: 'outcome',
            databaseField: 'search.CallOutcome',
            name: 'Result',
            inNotIn: false
        },
        {
            id: 11,
            inputType: 'text',
            searchValue: 'cloc',
            databaseField: 'search.CurrentLocation',
            name: 'Current location',
            inNotIn: false
        },
        {
            id: 12,
            inputType: 'date',
            searchValue: 'releasedate',
            databaseField: 'CAST(search.ReleaseDate AS DATE)',
            name: 'Release date',
            inNotIn: false
        },
        {
            id: 13,
            inputType: 'date',
            searchValue: 'dieddate',
            databaseField: 'CAST(search.DiedDate AS DATE)',
            name: 'Died date',
            inNotIn: false
        },
        {
            id: 14,
            inputType: 'boolean',
            searchValue: 'tycall',
            databaseField: 'search.PatientId IN (SELECT PatientId FROM AAU.PatientCall WHERE CallTypeId=1)',
            name: 'Thanked',
            inNotIn: true
        }
    ];

    @HostListener('document:keydown.enter', ['$event'])
    executeSearchByEnter(event: KeyboardEvent) {
        event.preventDefault();
        this.executeSearch();
    }

  constructor(
    public rescueDialog: MatDialog,
    public callDialog: MatDialog,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    public platform: Platform) { }

  ngOnInit(): void {
  this.navigationService.isSearchClicked.subscribe((clicked)=> {
      if(clicked){
          console.log(clicked)
            this.searchBox.nativeElement.focus();
      }
  });
  this.searchForm = this.formBuilder.group({
    searchRows: this.formBuilder.array([])
  });

  this.searchShowing = false;

  this.searchRows = this.searchForm.get('searchRows') as FormArray;

  }

  createItem(field: any, term: any): FormGroup {
    return this.formBuilder.group({
        searchField: [field, Validators.required],
        searchTerm: [term, Validators.required],
    });
}

displayFn(user?: SearchValue): string | undefined {
    return user ? user.name : undefined;
}

executeSearch() {
    if (this.searchShowing) {
        this.searchShowing = !this.searchShowing;
        this.search.searchString = this.getSearchString();
    } else {
        this.updateSearchArray();
    }

    // If we're on a mobile device, hide the keyboard after searching.
    if (document.activeElement instanceof HTMLElement && (this.platform.ANDROID || this.platform.IOS)) {
        document.activeElement.blur();
      }

    const searchArray = this.getSearchArray();


    const searchQuery = searchArray
        .map(item => {
            const splitItem = item.split(':');

            const option = this.options.find(
                optionVal => optionVal.searchValue === splitItem[0].toLowerCase(),
            );

            // If we're dealing with an IN/NOT IN query, then change the IN/NOT IN depending on
            // what the user has entered into the Search Term field
            if(option?.inNotIn){


                option.databaseField = option.databaseField?.replace(' NOT IN (', ' IN (');

                if(encodeURIComponent(splitItem[1].trim()).toLowerCase() === 'no'){

                    option.databaseField = option.databaseField?.replace(' IN (', ' NOT IN (');
                }

                return option.databaseField + encodeURIComponent(splitItem[1].trim());

            }
            else{

                return option?.databaseField + '=' + encodeURIComponent(splitItem[1].trim());
            }
        })
        .join('&');

     this.searchString.emit(searchQuery);
}

toggleSearchBox() {

    if (this.searchShowing) {
        this.search.searchString = this.getSearchString();
    } else {
        this.updateSearchArray();
        // tslint:disable-next-line:no-unused-expression
        this.searchRows.length === 0 ? this.addRow() : null;

    }
    this.searchShowing = !this.searchShowing;
}

updateSearchArray() {
    // If the field is empty we don't need to do anything.
    if (!this.search.searchString) {
        return;
    }

    const searchArray = this.getSearchArray();

    // Get the array of form elements and clear it out. We'll rebuild it from the
    // search text box
    this.searchRows = this.searchForm.get('searchRows') as FormArray;
    this.searchRows.clear();

    // Rebuild the search array form the search field
    searchArray.forEach(item => {
        const splitItem = item.split(':');

        const option = this.options.find(
            optionVal => optionVal.searchValue === splitItem[0].toLowerCase(),
        );

        this.searchRows.push(
            this.createItem(option?.id, splitItem[1].trim()),
        );
    });


}

getSearchArray() {

    // Filter out any empty values and then create a regex string which uses
    // the searchValue from the options array as a delimiter. This way we get a nice list
    // of all the search fields
    const regex = this.options
        .filter(option => option.searchValue != null)
        .map(item => {
            return '(?=' + item.searchValue + ')';
        })
        .join('|');


    const delimiter = new RegExp(regex);

    const toSplit =
        (this.search.searchString.toLowerCase().search(delimiter) !== 0
            ? 'tagno:'
            : '') + this.search.searchString;

    return toSplit.split(delimiter);
}

getSearchString() {
    // Get the search array
    const searchArray = this.searchForm.get('searchRows') as FormArray;

    // Create a nice string of all of the values for the user to look at
    const searchText = searchArray.controls
        .map(item => {
            const option = this.options.find(currentOption => currentOption.id === item.value.searchField);

            return option?.searchValue + ':' + item.value.searchTerm;
        })
        .join(' ');

    // Put the formatted string back into the text box.
    return searchText;
}

addRow() {

    this.searchRows.push(this.createItem('', ''));
}

removeRow(i:any) {
    this.searchRows.removeAt(i);
}

}
