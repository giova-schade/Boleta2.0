import { Component, OnInit } from "@angular/core";
import { AuthService } from '../../services/auth.services';

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"]
})
export class AdminLayoutComponent implements OnInit {
  public sidebarColor: string = "red";
  usurio: any;
  constructor(private authService: AuthService) {
    
  }

  
  ngOnInit() {
    
  }
}
