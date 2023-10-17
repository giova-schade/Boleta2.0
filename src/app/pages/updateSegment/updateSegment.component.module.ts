import { CommonModule , } from '@angular/common';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core' ;
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PrettyJsonPipe} from "./prettyjson.pipe";
import {ButtonModule} from 'primeng/button';
import { updateSegmentComponent } from './updateSegment.component';
import { ProgressBarModule } from 'primeng/progressbar';
import {BlockUIModule} from 'primeng/blockui';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@NgModule({

    imports:[
        ToastModule,
        MessageModule,
        MessagesModule,
        BlockUIModule,
        ProgressBarModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        ButtonModule
    ],
    declarations:[updateSegmentComponent , PrettyJsonPipe],
    exports:[
        updateSegmentComponent,
        CommonModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class updateSegment {}