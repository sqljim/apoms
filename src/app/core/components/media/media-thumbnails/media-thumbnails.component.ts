import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Gallery, Image } from 'src/app/core/models/media';
import { MediaPreviewComponent } from '../media-preview/media-preview.component';
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'media-thumbnails',
    templateUrl: './media-thumbnails.component.html',
    styleUrls: ['./media-thumbnails.component.scss']
})
export class MediaThumbnailsComponent implements OnInit{
    @Input() gallery!:Image[];

    constructor (public dialog: MatDialog) {}

    ngOnInit(): void {
       
    }
    openPreviewDialog(image:Image){
        const dialogRef = this.dialog.open(MediaPreviewComponent, {
            minWidth: '80vw',
            panelClass: 'media-preview-dialog',
            data: {
                image,
            }
          });
    }
}