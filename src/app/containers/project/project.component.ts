import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/utils/constants';
import { AppService } from 'src/app/utils/services/app.service';
import { AddProjectComponent } from './add-project/add-project.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  public projects: any;

  constructor(private appService: AppService, private modalService: NgbModal,
    private router: Router,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadProject();
  }


  addProject() {
    const modelRef = this.modalService.open(AddProjectComponent, {
      backdrop: 'static',
      windowClass: 'dark-modal',
      centered: true,
      keyboard: false,
      size: 'md'
    });
    modelRef.result.then(() => { }, () => {
      this.loadProject();
    });
  }

  /**
   * Select Project
   */
  selectProject(projectId) {
    sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.PROJECT_ID, projectId);
    this.router.navigate([Constants.URL.PROJECT_ISSUE,projectId]);
  }


  /**
 * Load Project
 */
  loadProject() {
    this.appService.getProjects().then(
      data => {
        this.projects = data;
        this.ref.markForCheck();
      });
  }
}
