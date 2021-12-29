import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/request/login-request';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment.prod';
import { Constants } from '../constants';
import { map } from "rxjs/operators";
import { UserRegistrationRequest } from 'src/app/model/request/user-registration';
import { ProjectRequest } from 'src/app/model/request/project-request';
import { IssueRequest } from 'src/app/model/request/issue-request';
import { IssueChangeRequest } from 'src/app/model/request/issue-change-request';
import { AssignRequest } from 'src/app/model/request/assign-request';

@Injectable({
  providedIn: 'root',
})
export class AppService {


  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'bearer-access-token, Access-Control-Max-Age, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Headers, Access-Control-Expose-Headers, Authorization, X-Requested-With',
      'Access-Control-Expose-Headers': '*',
      'Access-Control-Max-Age': '4800',
    }),
  };

  constructor(private httpClient: HttpClient,
    private router: Router) { }


  /**
   * Changed Assignee
   * @param assignRequest 
   * @returns 
   */
  changeAssignee(assignRequest: AssignRequest) {
    return this.httpClient.put(
      environment.endPoinUrl.concat(Constants.API_END_POINTS.ASSIGN),
      assignRequest,
      this.httpOptions
    );
  }


  /**
   * Load Issue
   * @param issueId 
   * @returns 
   */
  getIssue(issueId: any) {
    return this.httpClient
      .get(
        environment.endPoinUrl.concat(Constants.API_END_POINTS.ISSUE + '/' + issueId),
        this.httpOptions
      ).toPromise();
  }
  /***
   * Get Change Log 
   */
  getChangeLog(id: any) {
    return this.httpClient
      .get(
        environment.endPoinUrl.concat(Constants.API_END_POINTS.LOGS + '/' + id),
        this.httpOptions
      ).toPromise();
  }


  /**
   * Change Issue state
   * @param itemChange 
   * @returns 
   */
  changeState(itemChange: IssueChangeRequest) {
    return this.httpClient.put(
      environment.endPoinUrl.concat(Constants.API_END_POINTS.ISSUE_CHANGE),
      itemChange,
      this.httpOptions
    );
  }




  /**
   * Load issue for sprint
   * @returns 
   */
  getIssues(projectId: number, state: string, issueType: string, assignee: string): Promise<any> {
    return this.httpClient
      .get(environment.endPoinUrl.concat(Constants.API_END_POINTS.ISSUE) + '?projectId=' + projectId +
        '&state=' + state + '&issueType=' + issueType + '&assignee=' + assignee,
        this.httpOptions
      ).toPromise();
  }

  /**
   * add Issue
   */
  addIssue(issueRequest: IssueRequest) {
    return this.httpClient.post(
      environment.endPoinUrl.concat(Constants.API_END_POINTS.ISSUE),
      issueRequest,
      this.httpOptions
    );
  }


  /**
   * Load Users
   */
  getUsers() {
    return this.httpClient
      .get(
        environment.endPoinUrl.concat(Constants.API_END_POINTS.USER),
        this.httpOptions
      ).toPromise();
  }

  /**
   * Create Project
   * @param projectRequest 
   * @returns 
   */
  addProject(projectRequest: ProjectRequest) {
    return this.httpClient.post(
      environment.endPoinUrl.concat(Constants.API_END_POINTS.PROJECT),
      projectRequest,
      this.httpOptions
    );
  }

  /**
   * Load Projects
   */
  getProjects() {
    return this.httpClient
      .get(
        environment.endPoinUrl.concat(Constants.API_END_POINTS.PROJECT),
        this.httpOptions
      ).toPromise();
  }

  /**
   * Create new User
   * @param registerForm 
   * @returns 
   */
  public registerUser(registerForm: UserRegistrationRequest) {
    return this.httpClient.post(
      environment.endPoinUrl.concat(Constants.API_END_POINTS.USER_REGISTER),
      registerForm,
      this.httpOptions
    );
  }
  /**
   * User Authenticate
   * @param loginRequest 
   * @returns 
   */
  public authenticate(loginRequest: LoginRequest) {
    return this.httpClient.post<any>(environment.endPoinUrl.concat(Constants.API_END_POINTS.LOGIN), loginRequest,
      this.httpOptions).pipe(
        map((userData) => {
          sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.USERNAME, loginRequest.username);
          const token = 'Bearer ' + userData.access_token;
          sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.TOKEN, token);
          sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.USER, JSON.stringify(userData));
          return userData;
        }
        ));
  }


  public isUserLoggedIn() {
    const user = sessionStorage.getItem('username');
    return !(user === null);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
