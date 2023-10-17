import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { AccessDenied } from "./layouts/access-denied/access-denied.component";
import { AuthService } from './services/auth.services';
import { PanelModule } from 'primeng/panel';




@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    PanelModule,
    ToastrModule.forRoot()
  ],
  declarations: [AppComponent,
                 AdminLayoutComponent ,
                 AccessDenied 
               ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
