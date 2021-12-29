import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AssignRequest } from 'src/app/model/request/assign-request';
import { IssueChangeRequest } from 'src/app/model/request/issue-change-request';
import { AppService } from 'src/app/utils/services/app.service';

@Component({
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.scss']
})
export class ViewIssueComponent implements OnInit {


  @Input()
  public issueId: any;
  public isSubmitButton = false;
  public changeLogs: any;
  public userList: any;
  public selectedUser: any;
  public issue: any;


  states: string[] = ["OPEN", "IN_PROGRESS", "TESTING", "DEPLOY"];
  selectedState: string;

  constructor(private toastr: ToastrService,
    private appService: AppService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private ref: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.loadIssue();
    this.loadChangeLog();
    this.loadUsers();
  }


  /**
   * change state
   * @param newSortOrder 
   */
  changeState(newSatate: string) {
    this.selectedState = newSatate;
    if (this.selectedState !== this.issue.currentState) {
      this.changeStatue(this.issue.id, this.issue.currentState, newSatate);
    }

  }

  /**
 * Apply statu change
 */
  changeStatue(itemId: string, previousState: string, currentState: string) {
    const itemChange: IssueChangeRequest = {
      issueId: itemId,
      fromState: previousState,
      toState: currentState
    }
    this.appService.changeState(itemChange).subscribe(
      data => {
        this.toastr.success('State Changed', 'Successfully');
      }, (error) => {
        this.toastr.error(error.error.error_message, 'Error');
      });
  }

  /**
   * Load Issue
   */
  loadIssue() {
    this.appService.getIssue(this.issueId).then(
      data => {
        this.issue = data;
        this.selectedState = this.issue.currentState;
        this.selectedUser = this.issue.assigneeId;
        this.ref.markForCheck();
      }, (error) => {
        this.toastr.error(error.error.error_message, 'Error');

      });
  }

  loadChangeLog() {
    this.appService.getChangeLog(this.issueId).then(
      data => {
        console.log(data);
        this.changeLogs = data;
        this.ref.markForCheck();
      }, (error) => {
        this.toastr.error(error.error.error_message, 'Error');

      });
  }

  /**
   * load users
   */
  loadUsers() {
    this.appService.getUsers().then(
      data => {
        this.userList = data;
        this.ref.markForCheck();
      });
  }

  /**
   * change Assignee
   * @param assigneeId 
   */
  onChangeAssignee(assigneeId) {
    this.changeAssignee(this.issue.id,assigneeId);
  }

  /**
* Apply Assignee change
*/
  changeAssignee(itemId: number, toAssignee: number) {
    const assignRequest: AssignRequest = {
      issueId: itemId,
      toAssignee: toAssignee,
    }
    this.appService.changeAssignee(assignRequest).subscribe(
      data => {
        this.toastr.success('Assignee Changed', 'Successfully');
      }, (error) => {
        this.toastr.error(error.error.error_message, 'Error');
      });
  }

  /**
   * Close Window
   */
  closeWindow() {
    this.activeModal.dismiss('Cross click');
  }


}
