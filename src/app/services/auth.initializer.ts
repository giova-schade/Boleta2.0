import { Injectable, APP_INITIALIZER } from '@angular/core';
import { AuthService, StartupData } from './auth.services';
import { Router } from '@angular/router';
import { Role } from '../models/role';

@Injectable({
    providedIn: 'root'
})
export class AuthInitializer {
    constructor(private authService: AuthService,private router: Router ) {}

    initialize(): Promise<any> {
        return this.authService.getStartupData('common/appinit', null).then((startupData: StartupData) => {
            this.login(startupData.groups[0].ROLE, startupData.groups[0].NOMBRE, '');
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