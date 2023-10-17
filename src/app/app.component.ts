import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, StartupData } from './services/auth.services';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PrimeNGConfig } from 'primeng/api';
import { Role } from './models/role';
import { error } from 'console';


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
    private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;



    this.authService.getStartupData('common/appinit', null).then((startupData: StartupData) => {
      console.log('startupData', startupData)
      this.login(startupData.groups[0].ROLE, startupData.groups[0].NOMBRE, '');

    }).catch((error: any) => {
      this.notify.showNotification('top', 'right', 4, 'Error al obtener los datos del usuario  ');
    });


    
  }


  login(role: any, name: string, info: any) {
    this.authService.login(role, name, info);

    if (!this.authService.isAuthorized()) {
      this.router.navigate(['access-denied']);
    } else {
      const validRol = Role;
      const rol = this.authService['user'].role as Role;
      console.log(validRol);
      console.log(rol);

    }


  }

}
