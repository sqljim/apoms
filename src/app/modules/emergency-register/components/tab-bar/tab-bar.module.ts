import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from './tab-bar.component';
import { EmergencyRecordModule } from '../emergency-record/emergency-record.module';
import { RecordSearchModule } from 'src/app/core/components/record-search/record-search.module';
import { RescueDetailsModule } from 'src/app/core/components/rescue-details/rescue-details.module';
import { MaterialModule } from 'src/app/material-module';
import { EmergencyDetailsModule } from 'src/app/core/components/emergency-details/emergency-details.module';
import { RescueDetailsDialogComponent } from 'src/app/core/components/rescue-details-dialog/rescue-details-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EmergencyCaseOutcomeModule } from '../emergency-case-outcome/emergency-case-outcome.module';
import { OutstandingCaseBoardModule } from '../outstanding-case-board/outstanding-case-board.module';
import { ReleaseAssignDialogComponent } from 'src/app/core/components/release-assign-dialog/release-assign-dialog.component';
import { ReleaseAssignModule } from 'src/app/core/components/release-assign/release-assign.module';


@NgModule({
    declarations: [
        TabBarComponent,
        RescueDetailsDialogComponent,
        ReleaseAssignDialogComponent
    ],
    imports: [
        CommonModule,
        EmergencyRecordModule,
        RecordSearchModule,
        RescueDetailsModule,
        EmergencyDetailsModule,
        MaterialModule,
        FlexLayoutModule,
        EmergencyCaseOutcomeModule,
        ReleaseAssignModule,
        OutstandingCaseBoardModule
    ],
    exports: [TabBarComponent]
})
export class TabBarModule {}
