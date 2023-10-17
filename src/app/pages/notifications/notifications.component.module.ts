import { CommonModule , } from '@angular/common';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core' ;
import { FormsModule } from '@angular/forms';

import { NotificationsComponent } from './notifications.component';

@NgModule({

    imports:[
        CommonModule
    ],
    declarations:[NotificationsComponent],
    exports:[
        NotificationsComponent,
        CommonModule,
        FormsModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class Notifications {}