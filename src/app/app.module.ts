import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, APP_INITIALIZER } from "@angular/core";
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
import { AuthInitializer } from './services/auth.initializer';



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
  providers: [AuthService,{
    provide: APP_INITIALIZER,
    useFactory: (authInitializer: AuthInitializer) => () => authInitializer.initialize(),
    deps: [AuthInitializer],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
