import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../environments/global.component';
import { AbstractControl } from '@angular/forms';
import { StateService } from './state.service'
import SASjs, { UploadFile } from '@sasjs/adapter'

@Injectable({
    providedIn: 'root'
  })
export class MaestrosService {

    private adapter: SASjs

    constructor(private http: HttpClient, private stateService: StateService) { 
        let sasjsConfigInput = (window as any).sasjsConfigInput || {}
        this.adapter = new SASjs(sasjsConfigInput)
    }
    public async login(username: string, password: string) {
        return this.adapter
            .logIn(username, password)
            .then(
                (res: { isLoggedIn: boolean; userName: string }) => {
                    console.log(res)
                    this.stateService.setIsLoggedIn(res.isLoggedIn)

                    this.stateService.username.next(res.userName)

                    return res.isLoggedIn
                },
                (err: any) => {
                    console.error(err)
                    this.stateService.setIsLoggedIn(false)
                    return false
                }
            )
            .catch((e: any) => {
                if (e === 403) {
                    console.error('Invalid host')
                }
                return false
            })
    }
    postCreateSegmento(formulario: any): Observable<any> {
        var formData: any = new FormData();
        formData.append('GRP_ESQUEMA_VALIDO', formulario.controls['GRP_ESQUEMA_VALIDO'].value);
        formData.append('GRP_HABILITADO', formulario.controls['GRP_HABILITADO'].value.code);
        formData.append('GRP_PERIOCIDAD', formulario.controls['GRP_PERIOCIDAD'].value.code);

        if (formulario.controls['GRP_VIGENCIA_FIN'].value.toString().length) {
            formData.append('GRP_VIGENCIA_FIN', formulario.controls['GRP_VIGENCIA_FIN'].value.toString().split(' ')[2] +
                formulario.controls['GRP_VIGENCIA_FIN'].value.toString().split(' ')[1] +
                formulario.controls['GRP_VIGENCIA_FIN'].value.toString().split(' ')[3]);
        }



        if (formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().length) {
            formData.append('GRP_VIGENCIA_INICIO', formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().split(' ')[2] +
                formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().split(' ')[1] +
                formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().split(' ')[3]);
        }



        var GRP_CODIGO = '&GRP_CODIGO=' + formulario.controls['GRP_CODIGO'].value;
        var GRP_DESCRIPCION = '&GRP_DESCRIPCION=' + formulario.controls['GRP_DESCRIPCION'].value;
        var GRP_NOMBRE = '&GRP_NOMBRE=' + formulario.controls['GRP_NOMBRE'].value;
        var GRP_AREA_NEGOCIO = '&GRP_AREA_NEGOCIO=' + formulario.controls['GRP_AREA_NEGOCIO'].value;
        var PARAM = GRP_CODIGO + GRP_DESCRIPCION + GRP_NOMBRE + GRP_AREA_NEGOCIO;

        return this.http.post(CONFIG.apiCreaSegmento + PARAM, formData);

    }

    postUpdateSegmento(formulario: any): Observable<any> {
        var formData: any = new FormData();
        formData.append('GRP_ESQUEMA_VALIDO', formulario.controls['GRP_ESQUEMA_VALIDO'].value);
        formData.append('GRP_HABILITADO', formulario.controls['GRP_HABILITADO'].value.code);
        formData.append('GRP_PERIOCIDAD', formulario.controls['GRP_PERIOCIDAD'].value.code);
        if (formulario.controls['GRP_VIGENCIA_FIN'].value != null) {
            if (formulario.controls['GRP_VIGENCIA_FIN'].value.toString().length) {
                formData.append('GRP_VIGENCIA_FIN', formulario.controls['GRP_VIGENCIA_FIN'].value.toString().split(' ')[2] +
                    formulario.controls['GRP_VIGENCIA_FIN'].value.toString().split(' ')[1] +
                    formulario.controls['GRP_VIGENCIA_FIN'].value.toString().split(' ')[3]
                );
            }
        }
        if (formulario.controls['GRP_VIGENCIA_INICIO'].value != null) {
            if (formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().length) {
                formData.append('GRP_VIGENCIA_INICIO', formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().split(' ')[2] +
                    formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().split(' ')[1] +
                    formulario.controls['GRP_VIGENCIA_INICIO'].value.toString().split(' ')[3]

                );
            }
        }


        var GRP_CODIGO = '&GRP_CODIGO=' + formulario.controls['GRP_CODIGO'].value.code;
        var GRP_DESCRIPCION = '&GRP_DESCRIPCION=' + formulario.controls['GRP_DESCRIPCION'].value;
        var GRP_NOMBRE = '&GRP_NOMBRE=' + formulario.controls['GRP_NOMBRE'].value;
        var GRP_AREA_NEGOCIO = '&GRP_AREA_NEGOCIO=' + formulario.controls['GRP_AREA_NEGOCIO'].value;
        var PARAM = GRP_CODIGO + GRP_DESCRIPCION + GRP_NOMBRE + GRP_AREA_NEGOCIO;
        return this.http.post(CONFIG.apiUpdateSegmento + PARAM, formData);
    }

    getlistSegmento(): Observable<any> {
        return this.http.get(CONFIG.apiListGrpCodigo);
    }
    getdatosSegmento(codigo: any): Observable<any> {
        var formData: any = new FormData();
        formData.append('GRP_CODIGO', codigo);
        return this.http.post(CONFIG.apiGetDatosSegmento, formData);
    }
    getSegmentos(): Observable<any> {
        return this.http.get(CONFIG.listSegment);
    }
    geRemoveSegmentos(formulario: any): Observable<any> {
        var formData: any = new FormData();
        formData.append('GRP_CODIGO', formulario['GRP_CODIGO']);
        return this.http.post(CONFIG.apiRemoveSegmento, formData);
    }
    geLogs(formulario: any): Observable<any> {
        var formData: any = new FormData();
        if (formulario.controls['FECHALOGS_MIN'].value != undefined && formulario.controls['FECHALOGS_MIN'].value) {
            formData.append('FECHALOGS_MIN', formulario.controls['FECHALOGS_MIN'].value.toString().split(" ")[2] + formulario.controls['FECHALOGS_MIN'].value.toString().split(" ")[1] + formulario.controls['FECHALOGS_MIN'].value.toString().split(" ")[3]);

        }
        if (formulario.controls['FECHALOGS_MAX'].value != undefined && formulario.controls['FECHALOGS_MAX'].value) {
            formData.append('FECHALOGS_MAX', formulario.controls['FECHALOGS_MAX'].value.toString().split(" ")[2] + formulario.controls['FECHALOGS_MAX'].value.toString().split(" ")[1] + formulario.controls['FECHALOGS_MAX'].value.toString().split(" ")[3]);

        }
        if (formulario.controls['GRP_CODIGO'].value != undefined && formulario.controls['GRP_CODIGO'].value.code) {
            formData.append('GRP_CODIGO', formulario.controls['GRP_CODIGO'].value.code);

        }
        if (formulario.controls['USUARIOLOGS'].value != undefined && formulario.controls['USUARIOLOGS'].value[0]) {
            formData.append('USUARIOLOGS', formulario.controls['USUARIOLOGS'].value);
        }
        return this.http.post(CONFIG.apiLogs, formData);
    }
    getRun(): Observable<any> {
        return this.http.get(CONFIG.apiRun);
    }
    getLogsError(): Observable<any> {
        return this.http.get(CONFIG.apiVerLogsError);
    }
    getEsquema(codigo: string): Observable<any> {
        var formData: any = new FormData();
        formData.append('GRP_CODIGO', codigo);
        return this.http.post(CONFIG.apiGetEsquema, formData);
    }


}