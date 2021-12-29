import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/utils/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { UserRegistrationRequest } from 'src/app/model/request/user-registration';
import { Constants } from 'src/app/utils/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public submitted = false;
  public isSubmitButton = false;
  public selectedUserType : any;

  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private appService: AppService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'register-page');
    this.registerForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      userType: new FormControl(null, Validators.required),
      retypePassword: new FormControl(null, Validators.required),
    });
  }

  register(registerForm) {
    this.submitted = true;
    this.isSubmitButton = true;
    if (this.registerForm.valid) {

      if (registerForm.password !== registerForm.retypePassword) {
        // this.submitted = false;
        registerForm.password.valid = false;
        registerForm.retypePassword.valid = false;
        this.isSubmitButton = false;
        this.toastr.warning('Password and confirm password not matched', 'Error');
        return;
      }
      const userRegistrationRequest: UserRegistrationRequest = {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        userType: registerForm.userType
      };

      this.appService.registerUser(userRegistrationRequest).subscribe(
        (data: any) => {
          sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.USERNAME, data.username);
          const token = 'Bearer ' + data.access_token;
          sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.TOKEN, token);
          sessionStorage.setItem(Constants.LOCAL_STORE_RESOURSES.USER, JSON.stringify(data));
          this.router.navigate([Constants.URL.SPRINTS]);
        },
        (error) => {
          this.submitted = false;
          this.isSubmitButton = false;
          this.toastr.error(error.error.errorMessage, 'Error');
        }
      );
    } else {
      this.toastr.error('Form not valid!', 'Error');
    }
  }

  get form() {
    return this.registerForm.controls;
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-page');
  }
}
