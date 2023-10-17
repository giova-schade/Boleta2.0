import { Routes } from "@angular/router";

import { createSegmentComponent } from "../../pages/createSegment/createSegment.component";
import { updateSegmentComponent } from "../../pages/updateSegment/updateSegment.component";
import { deleteSegmentComponent } from "../../pages/deleteSegment/deleteSegment.component";
import { updateCodeSegmentComponent } from "../../pages/updateCodeSegment/updateCodeSegment.component";
import { viewLogsComponent } from "../../pages/viewLogs/viewLogs.component";
import { runValidatorComponent } from "../../pages/runValidator/runValidator.component";
import { viewSegmentComponent } from "../../pages/viewSegment/viewSegment.component";

export const AdminLayoutRoutes: Routes = [
  { path: "createSegment", component: createSegmentComponent },
  { path: "updateSegment", component: updateSegmentComponent },
  { path: "deleteSegment", component: deleteSegmentComponent },
  { path: "updateCodeSegment", component: updateCodeSegmentComponent },
  { path: "viewLogs", component: viewLogsComponent },
  { path: "runValidator", component: runValidatorComponent },
  { path: "viewSegment", component: viewSegmentComponent }
  
  
];
