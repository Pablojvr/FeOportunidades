import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginValid: boolean = false;
  loading: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.loginForm = this._fb.group({
      email: [null, [Validators.required]],
      password: [null, Validators.required],
    });
  }

  ngOnInit() {}
  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this._authService
      .loginUser(this.form.email.value, this.form.password.value)
      .subscribe({
        next: (_) => {
          this.loading = false;
          this.loginValid = true;
          this._router.navigate(['/home']);
        },
        error: (error) => {
          Swal.fire({
            title: '',
            text: error.message ?? '' + error.error ?? '',
            icon: 'error',
            heightAuto: false,
          });
          this.loginValid = false;
          this.loading = false;
        },
      });
  }
}
