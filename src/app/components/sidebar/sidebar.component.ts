import { Component, OnInit } from "@angular/core";
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.services';
export const ROUTES: MenuItem[] = [];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[] | undefined;
  items!: MenuItem[];
  URIS: MenuItem[];
  role :any;
  constructor(private authService: AuthService) { 
    this.URIS = [];
  }

  ngOnInit() {
    this.role = this.authService.GetuserInfo();
    this.URIS = this.authService.GetUserOptions(this.role.role);
    this.items = this.URIS.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
