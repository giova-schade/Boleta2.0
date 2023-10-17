import { Component, OnInit, ViewChild } from "@angular/core";
import { NotificationsComponent } from './../../pages/notifications/notifications.component';
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Table } from "primeng/table";
import { Message, MessageService } from 'primeng/api';
import { AuthService, StartupData } from "src/app/services/auth.services";

@Component({
  selector: "app-runValidator",
  templateUrl: "runValidator.component.html",
  styleUrls: ["runValidator.component.scss"],
  providers: [MessageService]
})
export class runValidatorComponent implements OnInit {
  datasourceLogs: any;
  LogsCampos: any;
  totalRecordsLogs: number;
  Logsview: boolean;
  multiSortSegmento: any;
  loading!: boolean;
  loadingPage: boolean;
  @ViewChild('Logs') Logs: any;
  constructor(
    private notify: NotificationsComponent,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    this.loadingPage = false;
    this.LogsCampos = [];
    this.totalRecordsLogs = 0;
    this.Logsview = false;
    this.multiSortSegmento = [];
  }

  ngOnInit() {

  }

  applyFilterGlobalLogst($event: any, stringVal: any) {
    this.Logs.filterGlobal($event.target.value, 'contains');

  }

  runSegmentos() {
    this.loadingPage = true;
    this.authService.getStartupData('common/start', null).then((startupData: StartupData) => {
      this.datasourceLogs = startupData.respuesta;
      this.totalRecordsLogs = this.datasourceLogs.length;

      if (this.totalRecordsLogs) {
        for (let campo in this.datasourceLogs[0]) {
          this.LogsCampos.push({ field: campo, header: campo });
          if (campo == 'LOG_DATETIME') {
            this.multiSortSegmento.push({ field: 'LOG_DATETIME', order: -1 });
          }
        }

      }
      this.loading = false;
      this.Logsview = true;
      this.loadingPage = false;
    }).catch((error: any) => {

      this.authService.getStartupData('common/verLogsError', null).then((startupDataB: StartupData) => {
        this.datasourceLogs = startupDataB.respuesta;
        this.totalRecordsLogs = this.datasourceLogs.length;

        if (this.totalRecordsLogs) {
          for (let campo in this.datasourceLogs[0]) {
            this.LogsCampos.push({ field: campo, header: campo });
            if (campo == 'LOG_DATETIME') {
              this.multiSortSegmento.push({ field: 'LOG_DATETIME', order: -1 });
            }
          }

        }
        this.loading = false;
        this.Logsview = true;
        this.loadingPage = false;
      }).catch((error: any) => {     
        this.messageService.add({
          severity: "error",
          detail: 'Error al obtener el registo de logs',
        });
        this.loadingPage = false;

      });

    });
    
  }
  clear(table: Table) {
    table.clear();
  }

}
