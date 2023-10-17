import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthGuard } from './route-routing.guards';
import { Role } from './models/role';
import { AccessDenied } from "./layouts/access-denied/access-denied.component";
import { MaestrosService } from "./services/maestro.service";

const routes: Routes = [
  {
    path: '' ,
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.BEADM]
    },
    children: [
      {
        path: '',
        loadChildren: () => import("./layouts/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: "access-denied",
    component: AccessDenied,
    children: [
      {
        path: "",
        loadChildren: () => import("./layouts/access-denied/access-denied.module").then(m => m.AccessDeniedLayoutModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    MaestrosService
  ]
})
export class AppRoutingModule { }
