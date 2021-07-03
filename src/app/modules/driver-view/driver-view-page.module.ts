import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverViewPageRoutingModule } from './driver-view-page-routing.module';
import { VehicleListPageComponent } from './pages/vehicle-list-page/vehicle-list-page.component';
import { MaterialModule } from 'src/app/material-module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CompletedAssignmentComponent } from './components/completed-assignment/completed-assignment.component';


@NgModule({
  declarations: [VehicleListPageComponent, CompletedAssignmentComponent],
  imports: [
    CommonModule,
    DriverViewPageRoutingModule,
    MaterialModule,
    DragDropModule
  ]
})
export class DriverViewPageModule { }
