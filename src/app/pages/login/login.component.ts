import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginValid: boolean = false;
  constructor(
      private _fb: FormBuilder,
      private _authService: AuthService,
      private _router: Router
  ) {
    this.loginForm = this._fb.group({
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
      this._authService.loginUser(this.form.email.value, this.form.password.value)
          .subscribe({
            next: _ => {
              this.loginValid = true;
              this._router.navigateByUrl('/index');
            },
            error: _ => this.loginValid = false
          });
  }
}
