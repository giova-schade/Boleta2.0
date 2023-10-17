import { CommonModule , } from '@angular/common';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core' ;
import { FormsModule } from '@angular/forms';

import { deleteSegmentComponent } from './deleteSegment.component';

@NgModule({

    imports:[
        CommonModule
    ],
    declarations:[deleteSegmentComponent],
    exports:[
        deleteSegmentComponent,
        CommonModule,
        FormsModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class deleteSegment {}