import { Component, OnInit } from "@angular/core";
import { MaestrosService } from "src/app/services/maestro.service";
import { StateService } from "src/app/services/state.service";

@Component({
  selector: "access-denied-layout",
  templateUrl: "./access-denied.component.html",
  styleUrls: ["./access-denied.component.scss"]
})
export class AccessDenied implements OnInit {
  Title: string ;
  Mensaje: string;
  public loginLoading: boolean = false
  public isLoggedIn: boolean = true


  constructor( private stateService: StateService, private master: MaestrosService,) {
    this.Title = ''; 
    this.Mensaje = ''; 
    
  }
   
  
  ngOnInit() {
      this.Title='Acceso denegado';
      this.Mensaje='El usuario no tiene acceso a la plataforma';
  }

  public login(credentials: { username: string; password: string ,}) {
    this.loginLoading = true

    this.master.login(credentials.username, credentials.password).then(
      (success: any) => {
        this.loginLoading = false

        if (!success) {
          alert('Wrong username or password, please try again.')
        }
      },
      (err: any) => {
        this.loginLoading = false
      }
    )
  }

}
