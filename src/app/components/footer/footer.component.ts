import { Component, OnInit } from "@angular/core";
import { AuthService } from '../../services/auth.services';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})
export class FooterComponent implements OnInit {
  usuario: any;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuario = this.authService.GetuserInfo();
  }
}
