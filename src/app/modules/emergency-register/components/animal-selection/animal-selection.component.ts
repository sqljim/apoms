import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTable }  from '@angular/material/table';
import { MatChip, MatChipList, MatDialog } from '@angular/material';
import { TagNumberDialog } from '../tag-number-dialog/tag-number-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DropdownService } from 'src/app/core/services/dropdown/dropdown.service';

export interface Problem {
  id: number;
  problem: string;
  problemStripped: string;
  }

  export interface AnimalType{
    id: number;
    animalType: string;
  }

  export interface Animal {
    position: number;
    speciesId: number;
    species: string;
    problems: Problem[];
    problemsString: string;
    tagNumber: string;
  }

@Component({
  selector: 'animal-selection',
  templateUrl: './animal-selection.component.html',
  styleUrls: ['./animal-selection.component.scss']
})

export class AnimalSelectionComponent implements OnInit{

  //I used animalTypes instead of species here to make the ngFors more readable (let specie(?) of species )
  animalTypes: AnimalType[];
  problems: Problem[];
  exclusions;

  @ViewChild(MatTable, {static: true}) animalTable: MatTable<any>;
  @ViewChild('speciesChips', {static: true}) speciesChips: MatChipList;
  @ViewChild('problemChips', {static: true}) problemChips: MatChipList;
  @Input() recordForm: FormGroup;

  animalArrayDisplayedColumns: string[] = ["select", "species", "mainProblem", "tagNo", "delete"];

  problemArray: Problem[] = [];
  animalArray: Animal[] = [{position: 1, speciesId: null, species: "", problems: this.problemArray, problemsString: "", tagNumber: ""}];

  currentAnimalChip = "";

  animalDataSource = new MatTableDataSource<Animal>(this.animalArray);

  selection = new SelectionModel<Animal>(false, [this.animalDataSource.data[0]]);

  tagNumber: string;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private dropdown: DropdownService) {}

  ngOnInit()
  {


    
    this.animalTypes = this.dropdown.getAnimalTypes();
    this.problems = this.dropdown.getProblems();
    this.exclusions = this.dropdown.getExclusions();
  }

  openDialog(currentAnimal): void {

    const dialogRef = this.dialog.open(TagNumberDialog, {
      width: '250px',
      data: {tagNumber: currentAnimal.tagNumber}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result != null)
      {
        let currentAnimal = this.getCurrentAnimal();
        currentAnimal.tagNumber = result;
      }

    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.animalDataSource.data.length;
      return numSelected === numRows;
  }

  toggleRow(row)
  {
    this.selection.toggle(row);
    this.clearChips();
    this.selection.selected.length != 0 ? this.reloadChips(this.getCurrentAnimal()) : null;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
      this.isAllSelected() ?
      this.selection.clear() :
      this.animalDataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Animal): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  clearChips()
  {

    this.currentAnimalChip = "";

    //Get all of the chip lists on the page and reset them all.
    this.speciesChips.chips.forEach(chip =>
    {
      chip.selected = false;
      chip.disabled = false;
      chip.selectable = true;
    });

    this.problemChips.chips.forEach(chip =>
    {
      chip.selected = false;
      chip.disabled = false;
      chip.selectable = true;
    });

  }

  reloadChips(currentAnimal)
  {

    this.speciesChips.chips.forEach(chip => {

      currentAnimal.species == chip.value ? chip.toggleSelected() : null;
      this.currentAnimalChip = chip.value;

    });

    currentAnimal.problems.forEach(problem => {

      this.problemChips.chips.forEach(chip => {

      problem.problem == chip.value ? chip.toggleSelected() : null;

      });

    });

  }

  toggleAnimalChip(speciesChip)
  {
    //Wait for the next tick until evrything is updated.
    setTimeout(() =>
    this.animalChipSelected(speciesChip)
  )

  }

  animalChipSelected(speciesChip)
  {
    this.currentAnimalChip = "";

    var selectedCount:number = this.selection.selected.length;

    if(selectedCount > 1)
    {
      alert("Please select only one animal in the table to change");
      return;
    }

    if(selectedCount == 1 && (speciesChip.selected ||
      !(this.speciesChips.selected instanceof MatChip)))
    {
      //There is only 1 row selected, so we can update the animal for that row
      let speciesObject = this.animalTypes.find(item =>
        item.animalType == speciesChip.value
      );

      let currentAnimal = this.getCurrentAnimal();

      currentAnimal.species = speciesChip.selected ? speciesObject.animalType : null;
      currentAnimal.speciesId = speciesChip.selected ? speciesObject.id : null;

      this.currentAnimalChip = speciesChip.value;

      //TODO update the animal array

      this.formArrayAnimalUpdate(currentAnimal);

      this.animalTable.renderRows();

      this.hideIrrelevantChips(speciesChip);

    }

    //if there are no rows, then we need to add a new one
    if(selectedCount == 0 && speciesChip.selected)
    {

      this.currentAnimalChip = speciesChip.value;

        let currentAnimal = this.animalTypes.filter(type => type.animalType == this.currentAnimalChip);

        let animalProblems:Problem[] = [];

        let position:number = (this.animalDataSource.data.length + 1);

        let newAnimal:Animal =
          {
            position: position,
            speciesId: currentAnimal[0].id,
            species: currentAnimal[0].animalType,
            problems: animalProblems,
            problemsString: animalProblems.map(item =>
              item.problem).join(","),
            tagNumber: ""

          };

        this.animalArray.push(newAnimal);
        this.formArrayAnimalAdd(newAnimal);;
        this.animalTable.renderRows();


        //Set the new row to be selected
        this.selection.select(this.animalDataSource.data.find(row =>
           row.position == position ));

           this.hideIrrelevantChips(speciesChip);

    }


  }

  cycleChips(key)
  {
      if(key.match(/^[A-Za-z]+$/))
      {
        let currentAnimal = this.getCurrentAnimal().species || "";

        let chips = this.speciesChips.chips;

        let lastInstance = "";
        let currentIndex;

        //Get the last value of the current key (e.g. last animal beginning with p)
        //Also get the index of the current item
        chips.forEach((item, index) => {
          if(item.value.substr(0,1).toLowerCase() == currentAnimal.substr(0,1).toLowerCase())
          {
            lastInstance =  item.value;
          }

          if(item.value == currentAnimal)
          {
            currentIndex = index;
          }

        })

        //Filter out any previous records so we can go directly to the next one in the list
        let currentArray = chips.filter((chip, index) => {

          return !(chip.value.substr(0,1).toLowerCase() == currentAnimal.substr(0,1).toLowerCase()
          && index <= currentIndex)
          || currentAnimal == ""
          || lastInstance == currentAnimal

        })

        //Get the chip we need
        let currentKeyChip = currentArray.find(chip => {
          return chip.value.substr(0,1).toLowerCase() == key.toLowerCase()
        });

        currentKeyChip.selected = true;
      }

  }

  problemChipSelected(problemChip)
  {

    if(!problemChip.selectable && problemChip.selected)
    {
      problemChip.selected = false;
      return;
    }

    if(this.currentAnimalChip == "" && !(this.speciesChips.selected instanceof MatChip))
    {
      alert("Please select an animal");
      problemChip.selected = false;
      return;
    }
    else{

      this.updateAnimalProblemArray(problemChip);

    }

  }

  hideIrrelevantChips(speciesChip)
  {

    let currentExclusions = this.exclusions.filter(animalType =>
      animalType.animalType == speciesChip.value);

    this.problemChips.chips.forEach(chip => {

      chip.disabled = false;
      chip.selectable = true;

    });

    if(!speciesChip.selected)
    {
      return;
    }

    currentExclusions[0].exclusionList.forEach(exclusion =>

      this.problemChips.chips.forEach(chip => {

        if(chip.value === exclusion)
        {
          chip.disabled = true;
          chip.selectable = false;
          chip.selected = false;

          this.updateAnimalProblemArray(chip);

        }
      })
    );

  }

  getCurrentAnimal()
  {
    return this.selection.selected[0];
  }

  deleteAnimalRow(row)
  {
    this.animalArray.splice(row.position - 1, 1);
    this.formArrayAnimalDelete(row.position - 1);


    this.clearChips();

    this.animalTable.renderRows();

    this.selection.clear();

  }

  updateAnimalProblemArray(problemChip)
  {
    //Get the current list of problems and replace the existing problem array

    let problemsObject:Problem = this.problems.find(item =>
      item.problem == problemChip.value
      );

    let currentAnimal = this.getCurrentAnimal();

    //If the problem chip has been selected we need to add it to the problem array of the animal
    //else we need to find this problem in the array and remove it.

    let problemIndex = currentAnimal.problems.findIndex(problem =>
      problem.id == problemsObject.id);

    problemChip.selected ?
      currentAnimal.problems.push(problemsObject)
      :
      problemIndex == -1 ? null : currentAnimal.problems.splice(problemIndex, 1);


    currentAnimal.problemsString = currentAnimal.problems.map(problem =>
        problem.problem).join(",");

    this.animalTable.renderRows();
  }

  updateTag(currentAnimal)
  {
    console.log(JSON.stringify(this.animalArray));
    // this.selection.isSelected(currentAnimal) ? null : this.toggleRow(currentAnimal);

    // this.openDialog(currentAnimal);
  }

  formArrayAnimalAdd(animal)
  {


    let newAnimal = this.fb.group({
      position: ['', Validators.required],
      speciesId: ['', Validators.required],
      species: ['', Validators.required],

      tagNumber: ['', Validators.required],

    })

    // problems: Problem[];
    // problemsString: string;

    let animalArray:FormArray = this.recordForm.get('animals') as FormArray;
    animalArray.push(newAnimal);
  }

  formArrayAnimalUpdate(animal)
  {

  }

  formArrayAnimalDelete(position)
  {

  }

}
