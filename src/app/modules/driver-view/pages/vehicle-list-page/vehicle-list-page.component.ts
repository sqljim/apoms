import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Vehicle, VehicleStatus, VehicleType } from 'src/app/core/models/driver-view';
import { DropdownService } from 'src/app/core/services/dropdown/dropdown.service';
import { MediaPasteService } from 'src/app/core/services/navigation/media-paste/media-paste.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { DriverViewService } from '../../services/driver-view.service';
import { MediaPreviewComponent } from 'src/app/core/components/media/media-preview/media-preview.component';

interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

@Component({
  selector: 'app-vehicle-list-page',
  templateUrl: './vehicle-list-page.component.html',
  styleUrls: ['./vehicle-list-page.component.scss']
})
export class VehicleListPageComponent implements OnInit {

  vehicleStatus: VehicleStatus[] = [
    {VehicleStatusId: 1, VehicleStatus: 'Active'},
    {VehicleStatusId: 2, VehicleStatus: 'Inactive'},
    {VehicleStatusId: 3, VehicleStatus: 'Damaged'}
  ];

  displayedColumns: string[] = [
    'vehicleType',
    'registrationNumber',
    'vehicleNumber',
    'largeAnimalCapacity',
    'smallAnimalCapacity',
    'minRescuerCapacity',
    'maxRescuerCapacity',
    'vehicleStatus',
    'vehicleImage'
  ];

  dataSource!: MatTableDataSource<Vehicle[]> ;

  imageSrc = '';
  file!:File;


  vehicleType$!: Observable<VehicleType[]>;

  vehicleListForm = this.fb.group({
    vehicleId: [],
    registrationNumber: [''],
    vehicleNumber:[''],
    vehicleTypeId: [],
    largeAnimalCapacity:[],
    smallAnimalCapacity: [],
    vehicleStatusId:[],
    minRescuerCapacity:[],
    maxRescuerCapacity:[],
    vehicleImage:''
  });


  constructor(private dropdown: DropdownService,
              private fb: FormBuilder,
              private driverViewService: DriverViewService,
              private snackBar: SnackbarService,
              private mediaPasteService:MediaPasteService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.vehicleType$ = this.dropdown.getVehicleType();
    this.refreshVehicleTable();
  }

  Submit(vehicleForm: FormGroup, event: Event) {
    if(vehicleForm.dirty)
    {
      this.mediaPasteService.handleImageUpload(this.file).then(uploadResult => {
        uploadResult.subscribe((result:any) => {
          if(result.success === 1) {
           
            vehicleForm.get('vehicleImage')?.setValue(result.remoteURL);
            this.driverViewService.upsertVehicleListItem(vehicleForm.value).then(response=> {
              if(response.success === -1) {
                this.snackBar.errorSnackBar('Communication error see adim', 'Ok');
              }
              else {
                if(response.success === 1) {
      
                  this.snackBar.successSnackBar('Saved Successfully', 'Ok');
                  this.refreshVehicleTable();
                 
                }
                else {
                  this.snackBar.errorSnackBar('Duplicate entry', 'Ok');
                }
      
              }
            });
          }
        });
      });
      
    }

  }

  refreshVehicleTable() {
    this.driverViewService.getVehicleListTableData().then((vehicleListTabledata)=> {
      this.dataSource = vehicleListTabledata;
    });
  }

  selectRow(selectedVehicle: any) {
    this.imageSrc = selectedVehicle.vehicleImage;
    this.vehicleListForm.patchValue(selectedVehicle);
  }

  deleteVehicle(vehicleId : number) {

   
    if(vehicleId) {
      this.driverViewService.deleteVehicleListItem(vehicleId).then(successResponse=> {

        if(successResponse.success === -1) {
          this.snackBar.errorSnackBar('Communication error see adim', 'Ok');
        }
        else {
          if(successResponse.success === 1) {
            this.snackBar.successSnackBar('Deleted Successfully', 'Ok');
            this.refreshVehicleTable();
          }
          else {
            this.snackBar.errorSnackBar('Unable to delete', 'Ok');
          }
        }

      });
    }

  }

  readURL(event: Event): void{
 
    event.preventDefault();
 
    this.file = ((event.target as HTMLInputElement).files as FileList)[0];
    
  
    if (this.file ) {
      
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;

      reader.readAsDataURL(this.file);
    }

  }

  reset($event:Event){
    $event.preventDefault();
    this.vehicleListForm.reset();
    this.imageSrc = '';
  }

  openMediaPreviewDialog($event:Event,imgUrl:string){
    $event.preventDefault();
    const dialogRef = this.dialog.open(MediaPreviewComponent, {

      minWidth: '53vw',
      panelClass: 'media-preview-dialog',
      data: {
        image: {
          full: imgUrl,
          type:'image'
        },
        showDataPanel: false 
      }

    });
  }

}