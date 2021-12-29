import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddIssueComponent } from 'src/app/containers/backlog/add-issue/add-issue.component';
import { AddProjectComponent } from 'src/app/containers/project/add-project/add-project.component';
import { Constants } from 'src/app/utils/constants';
import { AppService } from 'src/app/utils/services/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup;
  public projectList: any;
  public selectedProjectId = 1;


  constructor(private appService: AppService,private modalService: NgbModal, 
    private router: Router,
    private ref: ChangeDetectorRef,


  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
    this.selectedProjectId = JSON.parse(sessionStorage.getItem(Constants.LOCAL_STORE_RESOURSES.PROJECT_ID));
    this.loadProject();
  }

  logout() {
    this.appService.logout();
  }

  onChangeProject(projectId: any) {
    this.selectedProjectId = projectId;
    sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.PROJECT_ID, projectId);
    this.router.navigate([Constants.URL.PROJECT_ISSUE,projectId]);
  }


  loadProjectView() {
    const modelRef = this.modalService.open(AddProjectComponent, {
      backdrop: 'static',
      windowClass: 'dark-modal',
      centered: true,
      keyboard: false,
      size: 'md'
    });
    modelRef.result.then(() => { }, () => { location.reload(); });
  }

  loadIssueView() {
    const modelRef = this.modalService.open(AddIssueComponent, {
      backdrop: 'static',
      windowClass: 'dark-modal',
      centered: true,
      keyboard: false,
      size: 'lg'
    });

    modelRef.result.then(() => { }, () => { 
      location.reload();
     });
  }


  /**
   * Load Project
   */
  loadProject() {
    this.appService.getProjects().then(
      data => {
        this.projectList = data;
        this.ref.markForCheck();
      });
  }
}
