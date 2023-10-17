import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export interface AppState {
  isUserLoggedIn: boolean
  startupData: any
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private isUserLoggedIn$ = new BehaviorSubject(true)
  public isUserLoggedIn = this.isUserLoggedIn$.asObservable()

  private startupData$ = new BehaviorSubject([])
  public startupData = this.startupData$.asObservable()

  public username = new BehaviorSubject('')

  public setIsLoggedIn(value: boolean) {
    this.isUserLoggedIn$.next(value)
  }

  public setStartupData(data: any) {
    this.startupData$.next(data)
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

}
