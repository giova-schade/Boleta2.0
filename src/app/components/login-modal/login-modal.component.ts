import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'sasjs-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  @Input() loginLoading: boolean = false

  @Output() loginButtonClicked: EventEmitter<{
    username: string
    password: string
  }> = new EventEmitter<{ username: string; password: string }>()

  username: string = ''
  password: string = ''

  constructor() {}

  ngOnInit() {}

  login() {
    this.loginButtonClicked.emit({
      username: this.username,
      password: this.password
    })
  }
}
