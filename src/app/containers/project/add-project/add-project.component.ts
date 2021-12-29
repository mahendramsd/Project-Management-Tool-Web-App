import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProjectRequest } from 'src/app/model/request/project-request';
import { AppService } from 'src/app/utils/services/app.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  public projectForm: FormGroup;
  public submitted = false;
  public isSubmitButton = false;

  constructor(
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private appService: AppService,) { }

  ngOnInit(): void {

    this.projectForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required),
    });
  }


  /**
   * Create Project
   * @param registerForm 
   */
  addProject(registerForm) {
    this.submitted = true;
    this.isSubmitButton = true;
    if (this.projectForm.valid) {
      const projectRequest: ProjectRequest = {
        name: registerForm.name,
        code: registerForm.code,
      };
      this.appService.addProject(projectRequest).subscribe(
        (data: any) => {
          this.toastr.success("Project Added Successfully !!", 'Success');
          this.activeModal.dismiss('Cross click');
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
    return this.projectForm.controls;
  }



}
