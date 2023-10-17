import { CUSTOM_ELEMENTS_SCHEMA, NgModule  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {PanelMenuModule} from 'primeng/panelmenu';
import {StyleClassModule} from 'primeng/styleclass';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from "primeng/inputtext";

import { ToastModule } from 'primeng/toast';
import { BrowserModule } from "@angular/platform-browser";
import { SasjsLogsComponent } from "./sasjs-logs/sasjs-logs.component";
import { LoginModalComponent } from './login-modal/login-modal.component'

import { ClarityModule } from "@clr/angular";


        

@NgModule({
  imports: [ClarityModule,RouterModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,ToastModule,InputTextModule,ToggleButtonModule,TieredMenuModule,MenubarModule,MenuModule,MegaMenuModule,CommonModule, RouterModule, NgbModule, DialogModule, ButtonModule, DropdownModule, FormsModule, PanelMenuModule, StyleClassModule],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent,SasjsLogsComponent,LoginModalComponent],
  exports: [FooterComponent, NavbarComponent, SidebarComponent,SasjsLogsComponent,LoginModalComponent],
})
export class ComponentsModule {
  constructor() {}

}
