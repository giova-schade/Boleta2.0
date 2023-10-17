import { Component, OnInit } from "@angular/core";
import { NotificationsComponent } from './../../pages/notifications/notifications.component';
import { MaestrosService } from '../../services/maestro.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { trigger, style, transition, animate, state } from '@angular/animations'
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { AuthService, StartupData } from "src/app/services/auth.services";
interface Periocidad {
  name: string,
  code: number
}
interface Codigos {
  name: string,
  code: number
}

interface Habilitado {
  name: string,
  code: number
}


@Component({
  selector: "app-updateSegment",
  templateUrl: "updateSegment.component.html",
  styleUrls: ["updateSegment.component.scss"],
  providers: [NotificationsComponent, MessageService]
})
export class updateSegmentComponent implements OnInit {
  GRP_CODIGO: string;
  codigos: Codigos[];
  periocidad: Periocidad[];
  stateName = 'close';
  habilitado: Habilitado[];
  hasChange: boolean = false;
  loadingPage: boolean;
  GRP_CODIGO_URL!: string;
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
    private formBuilder: UntypedFormBuilder,
    private master: MaestrosService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService,

  ) {
    this.loadingPage = false;
    this.GRP_CODIGO = "";
    this.codigos = [];
    this.periocidad = [
      { name: 'No definida', code: 0 },
      { name: 'Diaria', code: 1 },
      { name: 'Semanal', code: 2 },
      { name: 'Mensual', code: 3 },
      { name: 'Otra', code: 4 },
    ];
    this.habilitado = [
      { name: 'Habilitado', code: 1 },
      { name: 'Deshabilitado', code: 0 },
    ];
  }



  ngOnInit() {
    this.loadingPage = true;


    this.authService.getStartupData('common/grpCodes', null).then((startupData: StartupData) => {
      let warning = 0;
      let Mensaje = '';
      startupData.respuesta.forEach(function (dato: any) {
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

        startupData.respuesta.forEach((element: any) => {
          console.log(element)
          this.codigos.push({ name: element['GRP_CODIGO'], code: element['GRP_CODIGO'] })
        });

        this.route.queryParams
          .subscribe(params => {
            console.log(params);
            this.GRP_CODIGO_URL = params["GRP_CODIGO"];
            if (this.GRP_CODIGO_URL) {
              this.authService.getStartupData('common/viewRecord', null).then((startupData: StartupData) => {
                let warning = 0;
                let Mensaje = '';
                startupData.respuesta.forEach(function (dato: any) {
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
                  for (let a in startupData.respuesta[0]) {
                    if (this.segmentoForm.controls.hasOwnProperty(a)) {
                      if (a == 'GRP_CODIGO') {
                        this.segmentoForm.controls[a].setValue({ name: startupData.respuesta[0][a], code: startupData.respuesta[0][a] })
                      } else if (a == 'GRP_PERIOCIDAD') {
                        if (this.periocidad.filter(x => x.name == startupData.respuesta[0][a])) {
                          var periocidadVar = this.periocidad.filter(x => x.name == startupData.respuesta[0][a])[0];
                          this.segmentoForm.controls[a].setValue(periocidadVar)
                        }

                      } else if (a == 'GRP_HABILITADO') {
                        if (this.habilitado.filter(x => x.name == startupData.respuesta[0][a])) {
                          var habilitadoVar = this.habilitado.filter(x => x.name == startupData.respuesta[0][a])[0];
                          this.segmentoForm.controls[a].setValue(habilitadoVar)
                        }
                      } else if (a == 'GRP_VIGENCIA_INICIO') {
                        if (startupData.respuesta[0][a] != null) {
                          var date = this.convertFromStringToDate(startupData.respuesta[0][a])
                          this.segmentoForm.controls[a].setValue(date)
                        } else {
                          this.segmentoForm.controls[a].setValue('')
                        }

                      } else if (a == 'GRP_VIGENCIA_FIN') {
                        if (startupData.respuesta[0][a] != null) {
                          var date = this.convertFromStringToDate(startupData.respuesta[0][a])
                          this.segmentoForm.controls[a].setValue(date)
                        } else {
                          this.segmentoForm.controls[a].setValue('')
                        }
                      } else if (a == 'GRP_ESQUEMA_VALIDO') {
                        this.cargoEsquema(this.GRP_CODIGO_URL);
                        //this.segmentoForm.controls[a].setValue(JSON.stringify(JSON.parse(result.respuesta[0][a].replaceAll("'", '"'))))
                      } else {
                        this.segmentoForm.controls[a].setValue(startupData.respuesta[0][a])
                      }
                    }

                  }
                  this.hasChange = false;
                  this.loadingPage = false;


                }
              }).catch((error: any) => {
                this.messageService.add({
                  severity: "error",
                  detail: 'Error al listar los datos',
                });

              });

            }

          }
          );


      }
      this.loadingPage = false;

    }).catch((error: any) => {
      this.messageService.add({
        severity: "error",
        detail: 'Error al listar los datos',
      });

    });



    const initialValue = this.segmentoForm.value;

    this.segmentoForm.statusChanges.subscribe(result => {
      this.hasChange = Object.keys(initialValue).some(key => this.segmentoForm.value[key] !=
        initialValue[key])
    }

    )


  }

  onCreateGroupFormValueChange() {
    const initialValue = this.segmentoForm.value
    this.segmentoForm.valueChanges.subscribe(value => {
      this.hasChange = Object.keys(initialValue).some(key => this.segmentoForm.value[key] !=
        initialValue[key])
    });
  }
  cargoEsquema(codigo: string) {

    this.authService.getStartupData('common/getSchema', null).then((startupData: StartupData) => {
      let warning = 0;
      let Mensaje = '';
      this.segmentoForm.controls['GRP_ESQUEMA_VALIDO'].setValue(JSON.stringify(startupData))
      this.hasChange = false;
    }).catch((error: any) => {
      this.messageService.add({
        severity: "error",
        detail: 'Error al obtener el esquema del segmento  ' + codigo,
      });

    });
  }
  OnChange(event: any) {
    this.loadingPage = true;
    this.authService.getStartupData('common/viewRecord', null).then((startupData: StartupData) => {
      let warning = 0;
      let Mensaje = '';
      startupData.respuesta.forEach(function (dato: any) {
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
        for (let a in startupData.respuesta[0]) {
          if (this.segmentoForm.controls.hasOwnProperty(a)) {
            if (a == 'GRP_CODIGO') {
              this.segmentoForm.controls[a].setValue({ name: startupData.respuesta[0][a], code: startupData.respuesta[0][a] })
            } else if (a == 'GRP_PERIOCIDAD') {
              if (this.periocidad.filter(x => x.name == startupData.respuesta[0][a])) {
                var periocidadVar = this.periocidad.filter(x => x.name == startupData.respuesta[0][a])[0];
                this.segmentoForm.controls[a].setValue(periocidadVar)
              }

            } else if (a == 'GRP_HABILITADO') {
              if (this.habilitado.filter(x => x.name == startupData.respuesta[0][a])) {
                var habilitadoVar = this.habilitado.filter(x => x.name == startupData.respuesta[0][a])[0];
                this.segmentoForm.controls[a].setValue(habilitadoVar)
              }
            } else if (a == 'GRP_VIGENCIA_INICIO') {
              if (startupData.respuesta[0][a] != undefined) {
                var date = this.convertFromStringToDate(startupData.respuesta[0][a])
                this.segmentoForm.controls[a].setValue(date)
              } else {
                this.segmentoForm.controls[a].setValue('')
              }

            } else if (a == 'GRP_VIGENCIA_FIN') {
              if (startupData.respuesta[0][a] != undefined) {
                var date = this.convertFromStringToDate(startupData.respuesta[0][a])
                this.segmentoForm.controls[a].setValue(date)
              } else {
                this.segmentoForm.controls[a].setValue('')
              }

            } else if (a == 'GRP_ESQUEMA_VALIDO') {
              this.cargoEsquema(event.code);
              //this.segmentoForm.controls[a].setValue(JSON.stringify(JSON.parse(result.respuesta[0][a].replaceAll("'", '"'))))
            } else {
              this.segmentoForm.controls[a].setValue(startupData.respuesta[0][a])
            }
          }

        }
        this.hasChange = false;
        this.loadingPage = false;



      }
    }).catch((error: any) => {
      this.messageService.add({
        severity: "error",
        detail: 'Error al obtener los datos del segmento ' + event.code,
      });

    });


  }
  convertFromStringToDate(responseDate: any) {
    var dia = responseDate.split('/')[0];
    var mes = responseDate.split('/')[1];
    var ano = responseDate.split('/')[2];
    return (new Date(ano + '/' + mes + '/' + dia))
  }
  updateSegmento(datos: any) {
    if (this.hasChange) {
      try {
        /**
         * check and try to parse value if it's not an object
         * if it fails to parse which means it is an invalid JSON
         */

        this.loadingPage = true;

        this.authService.getStartupData('common/updateCode', null).then((startupData: StartupData) => {
          let warning = 0;
          let Mensaje = '';
          startupData.respuesta.forEach(function (dato: any) {
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
            this.hasChange = false;
          }
          this.loadingPage = false;
        }).catch((error: any) => {
          this.messageService.add({
            severity: "error",
            detail: "Error al actualizar los datos.",
          });
    
        });

      } catch (e) {
        this.messageService.add({
          severity: "error",
          detail: 'Error al enviar el esquema.',
        });
        console.error(e)
        this.loadingPage = false;
      }
    } else {
      this.messageService.add({
        severity: "warn",
        detail: 'No hay cambios en el segmento.',
      });
      
      this.loadingPage = false;

    }

  }
}
