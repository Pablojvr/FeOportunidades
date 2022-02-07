import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
    email: [null, [Validators.required]],
    password: [null, Validators.required]
});
}

  ngOnInit() {

  }
  get form()
  {
      return this.loginForm.controls;
  }

  onSubmit() {
      this.authService.loginUser(this.form.email.value, this.form.password.value)
          .subscribe(
              data => {
                  console.log(data);
              },
              error => {
                  console.log(error);
              });
  }
}
