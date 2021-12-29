import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from '../../utils/services/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from 'src/app/model/request/login-request';
import { Constants } from 'src/app/utils/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public isAuthLoading = false;
  public submitted = false;
  public user: any;
  public selectedProjectId: any;

  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private appService: AppService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'login-page');
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  login() {
    if (!this.loginForm.invalid) {
      this.submitted = true;
      const loginRequest = new LoginRequest();
      loginRequest.username = this.form.username.value;
      loginRequest.password = this.form.password.value;
      this.appService.authenticate(loginRequest).subscribe((data) => {
        if (data) {
          this.selectedProjectId = sessionStorage.getItem(Constants.LOCAL_STORE_RESOURSES.PROJECT_ID);
          if (this.selectedProjectId) {
            this.router.navigate([Constants.URL.PROJECT_ISSUE,this.selectedProjectId]);
          } else {
            this.router.navigate([Constants.URL.PROJECT]);
          }

        }
      }, (error) => {
        this.submitted = false;
        this.toastr.error(error.error.errorMessage, 'Login Failed');
      });
    } else {
      this.submitted = true;
    }
  }

  get form() {
    return this.loginForm.controls;
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-page');
  }
}
