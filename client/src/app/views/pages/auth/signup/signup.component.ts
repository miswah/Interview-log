import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/views/services/user-management/user-management.service';

import { Signup } from 'src/app/views/shared/interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public SignupModel: any;
  public isConfirmPasswordValid: boolean = true;
  constructor(
    private userService: UserManagementService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.SignupModel = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]{5}$')],
      ],
      confirmpassword: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]{5}$')],
      ],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.passwordValidator();
  }

  onSubmit(fomrValue: Signup): void {
    // console.log(this.SignupModel.controls['name'].value);
    console.log(fomrValue);
  }

  tost() {
    console.log('clicked');
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  passwordValidator() {
    this.SignupModel.controls['confirmpassword'].valueChanges.subscribe(
      (val: number) => {
        if (val == this.SignupModel.controls['password'].value) {
          this.isConfirmPasswordValid = true;
        } else {
          this.isConfirmPasswordValid = false;
        }
      }
    );

    this.SignupModel.controls['password'].valueChanges.subscribe(
      (val: number) => {
        if (val == this.SignupModel.controls['confirmpassword'].value) {
          this.isConfirmPasswordValid = true;
        } else {
          this.isConfirmPasswordValid = false;
        }
      }
    );
  }
}
