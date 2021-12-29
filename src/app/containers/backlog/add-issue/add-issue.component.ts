import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IssueRequest } from 'src/app/model/request/issue-request';
import { ProjectRequest } from 'src/app/model/request/project-request';
import { Constants } from 'src/app/utils/constants';
import { AppService } from 'src/app/utils/services/app.service';

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.scss']
})
export class AddIssueComponent implements OnInit {

  public issueForm: FormGroup;
  public submitted = false;
  public isSubmitButton = false;
  public userList: any;
  public projectList: any;
  public selectedIssueType = 'BUG'
  public selectedUser = 0;
  public selectedProjectId: any;

  constructor(
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private appService: AppService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.selectedProjectId = sessionStorage.getItem(Constants.LOCAL_STORE_RESOURSES.PROJECT_ID);
    this.issueForm = new FormGroup({
      projectId: new FormControl(null, Validators.required),
      issueType: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      userId: new FormControl(null, Validators.required),
    });
    this.loadProject();
    this.loadUsers();
  }


  /**
   * Create Issue
   * @param registerForm 
   */
   addIssue(issueForm) {
    this.submitted = true;
    this.isSubmitButton = true;
    if (this.issueForm.valid) {
      const issueRequest: IssueRequest = {
        projectId: issueForm.projectId,
        issueType: issueForm.issueType,
        title: issueForm.title,
        userId: issueForm.userId,
        fromState: Constants.ISSUE_STATE.OPEN,
        toState: Constants.ISSUE_STATE.OPEN
      };
      this.appService.addIssue(issueRequest).subscribe(
        (data: any) => {
          this.toastr.success("Issue Added Successfully !!", 'Success');
          this.activeModal.dismiss('Cross click');
          location.reload();
        },
        (error) => {
          this.submitted = false;
          this.isSubmitButton = false;
          this.toastr.error(error.error.error_message, 'Error');
        }
      );
    } else {
      this.toastr.error('Form not valid!', 'Error');
    }
  }

  get form() {
    return this.issueForm.controls;
  }

  loadUsers() {
    this.appService.getUsers().then(
      data => {
        this.userList = data;
        this.ref.markForCheck();
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
