import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IssueChangeRequest } from 'src/app/model/request/issue-change-request';
import { AppService } from 'src/app/utils/services/app.service';
import { ViewIssueComponent } from './view-issue/view-issue.component';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  public board: any;
  public projectId: any;
  public userList: any;
  public selectedUser = '0';
  public selectedState = '0';
  public selectedIssueType = '0';


  constructor(private toastr: ToastrService,
    private appService: AppService,
    private modalService: NgbModal, 
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getUrlParameters();
    this.loadUsers();

  }


  public getUrlParameters() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      this.loadIssues(this.projectId,this.selectedState,this.selectedIssueType,this.selectedUser);
    });
  }


  loadIssues(projectId: number, state: string, issueType: string, assignee: string) {
    this.appService.getIssues(projectId,state,issueType,assignee).then(
      data => {
        this.board = data;
        this.ref.markForCheck();
      }, (error) => {
        this.toastr.error(error.error.error_message, 'Error');

      });
  }

  onChangeAssignee(assignee) {
    this.loadIssues(this.projectId,this.selectedState,this.selectedIssueType,this.selectedUser);
  }

  onChangeState(state) {
    this.loadIssues(this.projectId,this.selectedState,this.selectedIssueType,this.selectedUser);
  }

  onChangeIssueType(issueType) {
    this.loadIssues(this.projectId,this.selectedState,this.selectedIssueType,this.selectedUser);
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
   * drop grid
   * @param event 
   */
  public dropGrid(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.board.columns, event.previousIndex, event.currentIndex);
  }

  /**
   * panel drop 
   * @param event 
   */
  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
     
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.changeStatue(event.item.element.nativeElement.id, event.previousContainer.id, event.container.id)

    }

  }

  /**
   * View Issue
   * @param issue 
   */
  viewIssue(issue:any) {
      const modelRef = this.modalService.open(ViewIssueComponent, {
      // backdrop: 'static',
      windowClass: 'dark-modal',
      centered: true,
      keyboard: false,
      size: 'xl'
    });
    modelRef.componentInstance.issueId = issue.id;
    modelRef.result.then(() => { }, () => { 
      this.loadIssues(this.projectId,this.selectedState,this.selectedIssueType,this.selectedUser);
     });
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
        this.loadIssues(this.projectId,this.selectedState,this.selectedIssueType,this.selectedUser);
        this.ref.markForCheck();
      }, (error) => {
        this.toastr.error(error.error.error_message, 'Error');
      });
  }

}


