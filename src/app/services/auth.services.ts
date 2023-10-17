import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Role, BEADM } from '../models/role';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { CONFIG } from '../../environments/global.component';
import { MenuItem } from 'primeng/api';
import { UrlSerializer } from '@angular/router';
import SASjs, { SASjsConfig } from '@sasjs/adapter';
import { StateService } from './state.service';



export const alllinks: MenuItem[] = [

    {
        label: 'Procesos de boleta electrónica',
        icon: '',
        items: [
            {
                routerLink: "/",
                label: "Inicio",
                icon: "pi pi-home"
            },
            {
                routerLink: "createSegment",
                label: "Crear segmento",
                icon: "pi pi-file"
            },
            {
                routerLink: "updateSegment",
                label: "Actualizar segmento",
                icon: "pi pi-pencil"
            },
            {
                routerLink: "viewSegment",
                label: "Ver Segmentos",
                icon: "pi pi-search-plus"
            },
            {
                routerLink: "viewLogs",
                label: "Ver Logs",
                icon: "pi pi-search"
            },
            {
                routerLink: "runValidator",
                label: "Ejecutar validador",
                icon: "pi pi-play"
            }
        ]
    }
];
export const links: MenuItem[] = []

export interface Area {
    AREA: string
}
export interface StartupData {
    respuesta: any;
    SYSDATE: string
    SYSTIME: string
    areas: Area[]
    login: boolean
    MF_GETUSER: string
    groups: any
}


@Injectable()

export class AuthService {
    private user: User = new User;
    private adapter: SASjs
    private isUserLoggedIn$ = new BehaviorSubject(true)
    public isUserLoggedIn = this.isUserLoggedIn$.asObservable()
    public username = new BehaviorSubject('')

    constructor(private http: HttpClient, private stateService: StateService,) {
        this.adapter = new SASjs(window.sasjsConfigInput);

    }
    isAuthorized() {
        return !!this.user;
    }

    hasRole(role: Role) {
        return this.isAuthorized() && this.user.role === role;
    }

    existe(role: string, roles: any) {
        for (let rol in roles) {
            if (rol == role) {
                return true;
            }
        }
        return false;
    }
    public getSasRequests() {
        return this.adapter.getSasRequests()
    }
    public logout() {
        this.adapter.logOut().then(() => {
            this.stateService.setIsLoggedIn(false)
            this.stateService.username.next('')
        })
    }
    public getSasjsConfig() {
        return this.adapter.getSasjsConfig();
    }
    public login(role: Role, name: any, info: any) {
        this.user = { role: role, name: name, info: info };
    }

    public GetuserInfo() {
        return this.user;
    }
    public GetUserOptions(role: any) {
        alllinks.forEach((link) => {
            this.pushlink(role, link);
        })
        return links;
    }
    public downloadTextFile(filename: string, text: string) {
        const element = document.createElement('a')
        element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
        )
        element.setAttribute('download', filename + '.txt')

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
    }
    public getStartupData(url: string, data?: any, config?: SASjsConfig): any {
        // host and path (app loc) are automatically added
        // by adapter based on configuration in the index.html
        url = 'services/' + url

        return new Promise((resolve, reject) => {
            this.adapter
                .request(url, data, config, () => {
                    //Needs log in in callback
                })
                .then(
                    (res: StartupData) => {
                        if (res.login === false) {
                            //not logged in
                            console.log('not logged in')
                        }

                        this.user.name = res.MF_GETUSER

                        resolve(res)
                    },
                    (err: any) => {
                        reject(err)
                    }
                )
        })
    }



    setIsLoggedIn(value: boolean) {
        this.isUserLoggedIn$.next(value)
    }
    getUser(): Observable<any> {
        return this.http.get(CONFIG.apiUrlLogin);
    }

    pushlink(role: string, link: any) {
        if (role == "BEADM") {
            let roleConfig = BEADM;

            if (this.ValidaUrl(link, roleConfig)) {
                link.routerLink = link.routerLink;
                links.push(link);

            }
            let subrl = this.PushSuburl(link, roleConfig, role);
            if (subrl.hasOwnProperty('items')) {
                if (subrl.items.length) {
                    links.push(subrl);
                }
            };
        }


    }
    PushSuburl(link: any, roleConfig: any, role: string) {
        var suburl = [];
        if (link.hasOwnProperty('items')) {
            for (let subitem in link.items) {
                if (link.items[subitem].routerLink.indexOf('/') > 0) {
                    for (let sub in roleConfig) {
                        if (sub == link.items[subitem].routerLink.split('/')[1] && roleConfig[sub] == 'Yes') {
                            link.items[subitem].routerLink = link.items[subitem].routerLink;
                            suburl.push(link.items[subitem]);
                        }
                    }
                } else {
                    for (let sub in roleConfig) {
                        if (sub == link.items[subitem].routerLink && roleConfig[sub] == 'Yes') {
                            link.items[subitem].routerLink = link.items[subitem].routerLink;
                            suburl.push(link.items[subitem]);
                        }
                    }
                }
            }
            link.items = suburl;
        }

        return link;
    }
    ValidaUrl(pagina: any, paginas: any) {
        for (let valor in paginas) {
            if (valor == pagina.routerLink && paginas[valor] == 'Yes') {
                return true;
            }
        }

        return false;
    }


}
