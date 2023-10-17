import { CommonModule , } from '@angular/common';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core' ;
import { FormsModule } from '@angular/forms';

import { viewSegmentComponent } from './viewSegment.component';
//ngprime
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SidebarModule } from 'primeng/sidebar';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { RippleModule } from 'primeng/ripple';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {BlockUIModule} from 'primeng/blockui';

import {PanelMenuModule} from 'primeng/panelmenu';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PrettyJsonPipe } from './prettyjson.pipe';

import { PanelModule } from 'primeng/panel';
import { MessageModule } from 'primeng/message';
@NgModule({

    imports:[
        ToastModule,
        MessageModule,
        PanelModule,
        MessagesModule,
        ConfirmDialogModule,
        CommonModule,
        TableModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        SliderModule,
        MultiSelectModule,
        ContextMenuModule,
        ToastModule,
        InputTextModule,
        ProgressBarModule,
        SidebarModule,
        ListboxModule,
        CheckboxModule,
        TabViewModule,
        RippleModule,
        ProgressSpinnerModule,
        BlockUIModule,
        PanelMenuModule
    ],
    declarations:[viewSegmentComponent , PrettyJsonPipe],
    exports:[
        viewSegmentComponent,
        CommonModule,
        FormsModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class viewSegment {}