import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module';
import { ReportingPageRoutingModule } from './reporting-page-routing.module';
import { SurgeriesByDateDialogComponent } from './components/surgeries-by-date-dialog/surgeries-by-date-dialog.component';
import { ReportingPageComponent } from './pages/reporting-page/reporting-page.component';
import { EmergencyCaseDialogComponent } from './components/emergency-case-dialog/emergency-case-dialog.component';

@NgModule({
    declarations: [
        ReportingPageComponent,
        SurgeriesByDateDialogComponent,
        EmergencyCaseDialogComponent
    ],
    imports: [
        CommonModule,
        ReportingPageRoutingModule,
        MaterialModule
    ],
})

export class ReportingPageModule {}
