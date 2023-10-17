import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { SASjsConfig } from '@sasjs/adapter'
import moment from 'moment'
import { SASjsRequestExtended } from './models/sasjs-request.model'
import { StateService } from "src/app/services/state.service";

@Component({
  selector: 'sasjs-logs',
  templateUrl: './sasjs-logs.component.html',
  styleUrls: ['./sasjs-logs.component.scss']
})
export class SasjsLogsComponent implements OnInit {


  modal:boolean
  private _show: boolean = false
  private _sasjsRequests: SASjsRequestExtended[] = []

  @Input() defaultDownloadBehaviour: boolean = true

  @Input()
  set show(value: boolean) {
    this._show = value
    this.showChange.emit(value)
  }
  @Input()
  set sasjsRequests(value: SASjsRequestExtended[]) {
    this._sasjsRequests = value
    if (value) this.sasjsReqestsChanged()
  }

  get show(): boolean {
    return this._show
  }
  get sasjsRequests(): SASjsRequestExtended[] {
    return this._sasjsRequests
  }

  @Input() sasjsConfig: SASjsConfig | undefined

  @Output() showChange = new EventEmitter()
  @Output() onDownloadLog = new EventEmitter<string>()
  @Output() onDownloadSourceCode = new EventEmitter<string>()
  @Output() onDownloadGeneratedCode = new EventEmitter<string>()

  public sasLogActive: boolean = true
  public sasSourceCodeActive: boolean = false
  public sasGeneratedCodeActive: boolean = false
  public tablesActive: boolean = false
  public workTables: any

  constructor(private stateService: StateService,) {

    this.modal = true;
  }

  ngOnInit(): void {

    this.modal = true;
  }
  public parseLogTimestamp(timestamp: any) {
    return `${this.formatTimestamp(timestamp)} ${this.timestampFromNow(
      timestamp
    )}`
  }

  public cutAppLoc(link: string) {
    if (!this.sasjsConfig) return link

    return link.replace(this.sasjsConfig.appLoc + '/', '')
  }

  public formatTimestamp(timestamp: any) {
    return moment(timestamp).format()
      ? moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
      : timestamp
  }

  public timestampFromNow(timestamp: any) {
    return moment(timestamp).format() ? ` (${moment(timestamp).fromNow()})` : ''
  }

  public modalShowChange(state: any) {
    this.show = state
  }

  public sasjsReqestsChanged() {
    for (let request of this.sasjsRequests) {
      this.parseErrorsAndWarnings(request)

      request.serviceLink = this.cutAppLoc(request.serviceLink)
      request.parsedTimestamp = this.parseLogTimestamp(request.timestamp)
    }
  }

  public goToLogLine(
    linkingLine: string,
    requestStackId: string,
    type: string
  ) {
    let allLines: any = document.querySelectorAll(
      `#${requestStackId} .log-wrapper.saslog font`
    )
    let logWrapper: any = document.querySelector(
      `#${requestStackId} .log-wrapper.saslog`
    )

    for (let line of allLines) {
      if (line.textContent.includes(linkingLine)) {
        logWrapper.scrollTop = line.offsetTop - logWrapper.offsetTop
        line.style.backgroundColor = '#61a2202b'

        setTimeout(() => {
          line.style = ''
        }, 3000)
      }
    }
  }

  public async parseErrorsAndWarnings(req: any) {
    if (!req || !req.logFile || typeof req.logFile !== 'string') return
    if (req['logErrors'] !== undefined || req['logWarnings'] !== undefined)
      return

    let errorLines = []
    let warningLines = []

    let logLines = req.logFile.split('\n')

    for (let i = 0; i < logLines.length; i++) {
      if (/<.*>ERROR/gm.test(logLines[i])) {
        let errorLine = logLines[i].substring(
          logLines[i].indexOf('E'),
          logLines[i].length - 1
        )
        errorLines.push(errorLine)
      } else if (/^ERROR/gm.test(logLines[i])) {
        errorLines.push(logLines[i])

        logLines[i] = '<font>' + logLines[i] + '</font>'
      }

      if (/<.*>WARNING/gm.test(logLines[i])) {
        let warningLine = logLines[i].substring(
          logLines[i].indexOf('W'),
          logLines[i].length - 1
        )
        warningLines.push(warningLine)
      } else if (/^WARNING/gm.test(logLines[i])) {
        warningLines.push(logLines[i])

        logLines[i] = '<font>' + logLines[i] + '</font>'
      }
    }

    req.logFile = logLines.join('\n')
    req.logErrors = errorLines
    req.logWarnings = warningLines
  }

  downloadLog(logFile: string) {
    this.onDownloadLog.emit(logFile)
    const timestamp = new Date().valueOf()
    this.stateService.downloadTextFile(`logFile-${timestamp}`, logFile)
  }

  downloadSourceCode(sourceCode: string) {
    this.onDownloadSourceCode.emit(sourceCode)
    const timestamp = new Date().valueOf()
    this.stateService.downloadTextFile(`sourceCode-${timestamp}`, sourceCode)
  }

  downloadGeneratedCode(generatedCode: string) {
    this.onDownloadGeneratedCode.emit(generatedCode)
    const timestamp = new Date().valueOf()
    this.stateService.downloadTextFile(
      `generatedCode-${timestamp}`,
      generatedCode
    )
  }
}
