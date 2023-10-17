import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NotificationsComponent } from './../../pages/notifications/notifications.component';
import { MaestrosService } from '../../services/maestro.service';
import { CONFIG } from '../../../environments/global.component';
import { Message, MessageService } from 'primeng/api';
interface Periocidad {
    name: string,
    code: number
}
interface Habilitado {
    name: string,
    code: number
}
@Component({
    selector: "app-createSegment",
    templateUrl: "createSegment.component.html",
    styleUrls: ["createSegment.component.scss"],
    providers: [NotificationsComponent, MessageService]
})



export class createSegmentComponent implements OnInit {
    messages: Message[] | undefined;
    GRP_CODIGO: string;
    GRP_ESQUEMA_VALIDO: String;
    GRP_PERIOCIDAD!: number;
    GRP_NOMBRE: String;
    GRP_DESCRIPCION: String;
    GRP_HABILITADO!: number;
    GRP_AREA_NEGOCIO: String;
    GRP_VIGENCIA_INICIO: Date;
    GRP_VIGENCIA_FIN: Date;
    periocidad: Periocidad[];
    habilitado: Habilitado[];
    GRP_NOMBRE_REQ: boolean;
    GRP_CODIGO_REQ: boolean;
    GRP_ESQUEMA_VALIDO_REQ: boolean;
    GRP_PERIOCIDAD_REQ: boolean;
    GRP_DESCRIPCION_REQ: boolean;
    GRP_HABILITADO_REQ: boolean;
    GRP_AREA_NEGOCIO_REQ: boolean;
    loadingPage: boolean;
    segmentoForm = new UntypedFormGroup({
        GRP_CODIGO: new UntypedFormControl('', Validators.required),
        GRP_ESQUEMA_VALIDO: new UntypedFormControl('', Validators.required),
        GRP_PERIOCIDAD: new UntypedFormControl('', Validators.required),
        GRP_NOMBRE: new UntypedFormControl('', Validators.required),
        GRP_DESCRIPCION: new UntypedFormControl('', Validators.required),
        GRP_HABILITADO: new UntypedFormControl('', Validators.required),
        GRP_AREA_NEGOCIO: new UntypedFormControl('', Validators.required),
        GRP_VIGENCIA_INICIO: new UntypedFormControl(''),
        GRP_VIGENCIA_FIN: new UntypedFormControl(''),
    });



    constructor(
        private notify: NotificationsComponent,
        private formBuilder: UntypedFormBuilder,
        private master: MaestrosService,
        private messageService: MessageService
    ) {
        this.loadingPage = false;
        this.GRP_CODIGO = '';
        this.GRP_ESQUEMA_VALIDO = '';
        this.GRP_NOMBRE = '';
        this.GRP_DESCRIPCION = '';
        this.GRP_AREA_NEGOCIO = '';
        this.GRP_VIGENCIA_INICIO = new Date();
        this.GRP_VIGENCIA_FIN = new Date();
        this.GRP_NOMBRE_REQ = false;
        this.GRP_CODIGO_REQ = false;
        this.GRP_ESQUEMA_VALIDO_REQ = false;
        this.GRP_PERIOCIDAD_REQ = false;
        this.GRP_DESCRIPCION_REQ = false;
        this.GRP_HABILITADO_REQ = false;
        this.GRP_AREA_NEGOCIO_REQ = false;


        this.periocidad = [
            { name: 'No definida', code: 0 },
            { name: 'Diaria', code: 1 },
            { name: 'Semanal', code: 2 },
            { name: 'Mensual', code: 3 }
        ];
        this.habilitado = [
            { name: 'Habilitado', code: 1 },
            { name: 'Inhabilitado', code: 0 }
        ];

    }

    //Create required field validator for name

    ngOnInit() {
        this.segmentoForm.statusChanges.subscribe(result => {
            if (this.segmentoForm.controls["GRP_CODIGO"].value != "") {
                this.GRP_CODIGO_REQ = false;
            }
            if (this.segmentoForm.controls["GRP_ESQUEMA_VALIDO"].value != "") {
                this.GRP_ESQUEMA_VALIDO_REQ = false;
            }
            if (this.segmentoForm.controls["GRP_NOMBRE"].value != "") {

                this.GRP_NOMBRE_REQ = false;
            }
            if (this.segmentoForm.controls["GRP_DESCRIPCION"].value != "") {

                this.GRP_DESCRIPCION_REQ = false;
            }
            if (this.segmentoForm.controls["GRP_AREA_NEGOCIO"].value != "") {

                this.GRP_AREA_NEGOCIO_REQ = false;
            }
            if (this.segmentoForm.controls["GRP_PERIOCIDAD"].value != "") {
                this.GRP_PERIOCIDAD_REQ = false;
            }
            if (this.segmentoForm.controls["GRP_HABILITADO"].value != "") {
                this.GRP_HABILITADO_REQ = false;
            }



        })


    }

    validaCampos(form: any) {
        let error = []
        for (let i in form.controls) {
            if (i == "GRP_CODIGO") {
                if (form.controls[i].value.length > CONFIG.GRP_CODIGO_LENGTH) {
                    error.push({ [i]: "Excede el largo máximo" })
                }
            } else if (i == "GRP_ESQUEMA_VALIDO") {
                if (form.controls[i].value.length > CONFIG.GRP_ESQUEMA_VALIDO_LENGTH) {
                    error.push({ [i]: "Excede el largo máximo" })
                }
            } else if (i == "GRP_NOMBRE") {
                if (form.controls[i].value.length > CONFIG.GRP_NOMBRE_LENGTH) {
                    error.push({ [i]: "Excede el largo máximo" })
                }
            } else if (i == "GRP_DESCRIPCION") {
                if (form.controls[i].value.length > CONFIG.GRP_DESCRIPCION_LENGTH) {
                    error.push({ [i]: "Excede el largo máximo" })
                }
            } else if (i == "GRP_AREA_NEGOCIO") {
                if (form.controls[i].value.length > CONFIG.GRP_AREA_NEGOCIO_LENGTH) {
                    error.push({ [i]: "Excede el largo máximo" })
                }
            }
        }
        return error;
    }

    creSegmento() {

        if (this.segmentoForm.valid) {
            try {
                /**
                 * check and try to parse value if it's not an object
                 * if it fails to parse which means it is an invalid JSON
                 */

                this.loadingPage = true;

                /*valida largo campos*/
                let formOk = this.validaCampos(this.segmentoForm);
                if (formOk.length == 0) {
                    this.master.postCreateSegmento(this.segmentoForm).subscribe({
                        next: (result) => {

                            let warning = 0;
                            let Mensaje = '';
                            result.respuesta.forEach(function (dato: any) {
                                if (dato.hasOwnProperty('MENSAJE')) {
                                    warning = 1;
                                    Mensaje = dato['MENSAJE'];
                                }
                            })

                            if (warning == 1) {
                                this.messageService.add({
                                    severity: "warn",
                                    detail: Mensaje,
                                });
                            } else {
                                this.messageService.add({
                                    severity: "success",
                                    detail: "Datos Guardados correctamente! ",
                                });
                            }
                            this.loadingPage = false;
                        },
                        error: (e) => {

                            console.log(e)
                            this.messageService.add({
                                severity: "error",
                                detail: "Error al guardar los datos.",
                            });
                            this.loadingPage = false;

                        },
                        complete: () => {


                        }
                    })

                } else {

                    formOk.forEach(obj => {
                        Object.entries(obj).forEach(([key, value]) => {
                            this.messageService.add({
                                severity: "error",
                                detail: "`${key} ${value}` .",
                            });
                        });
                    });
                    this.loadingPage = false;


                }

            } catch (e) {
                this.messageService.add({
                    severity: "error",
                    detail: "Error al enviar el esquema .",
                });
                console.log(e)
                this.loadingPage = false;
            }
        } else {
            this.messageService.add({
                severity: "warn",
                detail: "Faltan campos obligatorios por completar.",
            });
            if (this.segmentoForm.controls["GRP_CODIGO"].value == "") {
                this.GRP_CODIGO_REQ = true;
            }
            if (this.segmentoForm.controls["GRP_ESQUEMA_VALIDO"].value == "") {
                this.GRP_ESQUEMA_VALIDO_REQ = true;
            }
            if (this.segmentoForm.controls["GRP_NOMBRE"].value == "") {
                this.GRP_NOMBRE_REQ = true;
            }
            if (this.segmentoForm.controls["GRP_DESCRIPCION"].value == "") {
                this.GRP_DESCRIPCION_REQ = true;
            }
            if (this.segmentoForm.controls["GRP_AREA_NEGOCIO"].value == "") {
                this.GRP_AREA_NEGOCIO_REQ = true;
            }
            if (this.segmentoForm.controls["GRP_PERIOCIDAD"].value == "") {
                this.GRP_PERIOCIDAD_REQ = true;
            }
            if (this.segmentoForm.controls["GRP_HABILITADO"].value == "") {
                this.GRP_HABILITADO_REQ = true;
            }
        }
    }
}

