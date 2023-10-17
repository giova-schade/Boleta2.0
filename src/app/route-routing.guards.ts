import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, StartupData } from './services/auth.services';
import { Role } from './models/role';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const startupData: StartupData = await this.authService.getStartupData('common/appinit', null);

        // Aquí puedes hacer algo con los datos de inicio si es necesario

        if (!this.authService.isAuthorized()) {
            this.router.navigate(['access-denied']);
            return false;
        }
        
        const roles = route.data['roles'] as Role[];
        if (roles && !roles.some(r => this.authService.hasRole(r))) {
            this.router.navigate(['access-denied']);
            return false;
        }
        
        return true;
    }
    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isAuthorized()) {
            return false;
        }

        const roles = route.data && route.data['roles'] as Role[];
        if (roles && !roles.some(r => this.authService.hasRole(r))) {
            return false;
        }

        return true;
    }
}
