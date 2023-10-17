import { Component, OnInit, ElementRef, OnDestroy , Output ,EventEmitter } from "@angular/core";
import { SASjsConfig, SASjsRequest } from '@sasjs/adapter'
import { NavLink, UserDropdownItem } from '@sasjs/ngx-sasjs'
import { ROUTES } from "../sidebar/sidebar.component";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.services';
import { MaestrosService } from "src/app/services/maestro.service";
import { MenuItem } from 'primeng/api';
import { Message, MessageService } from 'primeng/api';
import { StateService } from "src/app/services/state.service";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  providers: [ MessageService],
})

export class NavbarComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  public isLoggedIn: boolean = true
  public loginLoading: boolean = false
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  public nameUser: string;
  public isCollapsed = true;
  public requestModal: boolean = false;
  public sasjsConfig: SASjsConfig = new SASjsConfig();
  public sasjsRequests: SASjsRequest[] = [];
  public username: string = '';
 
  closeResult: string | undefined;
  usuario: any;
  @Output() onDownloadLog = new EventEmitter<string>()
  @Output() onDownloadSourceCode = new EventEmitter<string>()
  @Output() onDownloadGeneratedCode = new EventEmitter<string>()
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private master: MaestrosService,
    private messageService: MessageService,
    private stateService: StateService,


  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.listTitles = [];

    this.usuario = this.authService.GetuserInfo();
    this.nameUser = "";
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    var navbar = document.getElementsByClassName('navbar')[0];
    if (window.innerWidth < 993 && !this.isCollapsed) {
      navbar.classList.add('bg-white');
      navbar.classList.remove('navbar-transparent');
    } else {
      navbar.classList.remove('bg-white');
      navbar.classList.add('navbar-transparent');
    }
  };
  ngOnInit() {
    this.getSasjsConfig()
    this.stateService.isUserLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn
    })

    this.stateService.username.subscribe((username: string) => {
      this.username = username
    })
    this.items = [
      {
        label: 'SAS Logs',
        icon: 'pi pi-search',
        command: () => this.openSasLogs()  // Define un método a ejecutar cuando se hace clic
      },
      {
        label: 'Documentation',
        icon: 'pi pi-book',
        command: () => this.openDocs()  // Define un método a ejecutar cuando se hace clic
      },
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: () => this.logout()  // Define un método a ejecutar cuando se hace clic
      }
    ];
    this.nameUser = this.usuario.name;
    window.addEventListener("resize", this.updateColor);
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe(event => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });

    this.authService.isUserLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    })
    this.authService.username.subscribe((username: string) => {
      this.username = username
    })
  }

  downloadLog(logFile: string) {
    this.onDownloadLog.emit(logFile)
    const timestamp = new Date().valueOf()
    this.authService.downloadTextFile(`logFile-${timestamp}`, logFile)
  }
  downloadSourceCode(sourceCode: string) {
    this.onDownloadSourceCode.emit(sourceCode)
    const timestamp = new Date().valueOf()
    this.authService.downloadTextFile(`sourceCode-${timestamp}`, sourceCode)
  }

  downloadGeneratedCode(generatedCode: string) {
    this.onDownloadGeneratedCode.emit(generatedCode)
    const timestamp = new Date().valueOf()
    this.authService.downloadTextFile(
      `generatedCode-${timestamp}`,
      generatedCode
    )
  }
  public miDownloadSourceCode (dato:any){
    console.log('asdas')
  }
  public openChange(open: boolean) {

    console.log(this.authService.getSasRequests());
    console.log('asds')
    if (open) this.sasjsRequests = this.authService.getSasRequests()
  }
  public getSasjsConfig() {
    this.sasjsConfig = this.authService.getSasjsConfig();
  }

  public openSasLogs() {
    this.requestModal = true
  }

  public openDocs() {
    window.location.replace(`${window.location.pathname}/docs`)
  }
  public logout() {
    this.authService.logout()
  }


  login(credentials: { username: string; password: string }) {
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
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName("nav")[0];
    if (!this.isCollapsed) {
      navbar.classList.remove("navbar-transparent");
      navbar.classList.add("bg-white");
    } else {
      navbar.classList.add("navbar-transparent");
      navbar.classList.remove("bg-white");
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );
    const html = document.getElementsByTagName("html")[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = "fixed";
    }

    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    html.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    this.toggleButton.classList.remove("toggled");
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );

    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = "";
      }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const html = document.getElementsByTagName('html')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const html = document.getElementsByTagName("html")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      html.classList.remove("nav-open");

      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (html.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (html.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);



      html.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);

    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].routerLink === titlee) {
        return this.listTitles[item].label;
      }
    }
    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].hasOwnProperty('items')) {
        for (var subitem = 0; subitem < this.listTitles[item].items.length; subitem++) {
          if (this.listTitles[item].items[subitem].routerLink === titlee) {
            return this.listTitles[item].items[subitem].label;
          }
        }
      } else {
        if (this.listTitles[item].routerLink === titlee) {
          return this.listTitles[item].label;
        }
      }

    }


    return "Administración";
  }

  open(content: any) {
    this.modalService.open(content, { windowClass: 'modal-search' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnDestroy() {
    window.removeEventListener("resize", this.updateColor);
  }
}
