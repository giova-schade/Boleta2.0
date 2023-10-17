import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
//componentes
import { Notifications } from "../../pages/notifications/notifications.component.module";
import { createSegment } from "../../pages/createSegment/createSegment.component.module";
import { updateCodeSegment } from "../../pages/updateCodeSegment/updateCodeSegment.component.module";
import { updateSegment } from "../../pages/updateSegment/updateSegment.component.module";
import { viewSegment } from "../../pages/viewSegment/viewSegment.component.module";
import { viewLogs } from "../../pages/viewLogs/viewLogs.component.module";
import { runValidator } from "../../pages/runValidator/runValidator.component.module";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// primeng
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
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
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';






@NgModule({
  imports: [
    runValidator,
    viewLogs,
    MessagesModule,
    ConfirmDialogModule,
    TableModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    SidebarModule,
    ListboxModule,
    ReactiveFormsModule,
    CheckboxModule,
    TabViewModule,
    RippleModule,
    ProgressSpinnerModule,
    BlockUIModule,
    PanelMenuModule,
    Notifications,
    createSegment,
    updateCodeSegment,
    viewSegment,

    

  ],
  declarations: [
    
  ],
  providers: []
})
export class AdminLayoutModule {}
