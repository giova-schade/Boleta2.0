import { Component, OnInit } from "@angular/core";
import { NotificationsComponent } from './../../pages/notifications/notifications.component';
import { MaestrosService } from '../../services/maestro.service';
import { FormControl, Validators, FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: "app-updateCodeSegment",
  templateUrl: "updateCodeSegment.component.html",
  styleUrls: ["updateCodeSegment.component.scss"],
  providers: [NotificationsComponent]
})
export class updateCodeSegmentComponent implements OnInit {


  constructor(
    private notify: NotificationsComponent,
    private formBuilder: UntypedFormBuilder,
    private master: MaestrosService

  ) { }

  ngOnInit() {

  }
}
