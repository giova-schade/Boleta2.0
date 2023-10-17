import { Component, OnInit } from "@angular/core";

@Component({
  selector: "access-denied-layout",
  templateUrl: "./access-denied.component.html",
  styleUrls: ["./access-denied.component.scss"]
})
export class AccessDenied implements OnInit {
  Title: string ;
  Mensaje: string;
  constructor() {
    this.Title = ''; 
    this.Mensaje = ''; 
  }
   
  
  ngOnInit() {
      this.Title='Acceso denegado';
      this.Mensaje='El usuario no tiene acceso a la plataforma';
  }
}
