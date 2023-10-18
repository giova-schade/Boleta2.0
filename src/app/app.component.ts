import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, StartupData } from './services/auth.services';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PrimeNGConfig } from 'primeng/api';
import { Role } from './models/role';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NotificationsComponent]
})
export class AppComponent {
  title = 'SII';
  constructor(
    private router: Router,
    private authService: AuthService,
    private notify: NotificationsComponent,
    private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }




}
