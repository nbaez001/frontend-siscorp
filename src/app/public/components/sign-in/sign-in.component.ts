import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Session } from '@shared/auth/Session';

@Component({
  selector: 'public-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  authForm: FormGroup;

  codigo: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      codigo: ['', [Validators.required, this.validarCodigo.bind(this)]]
    });
  }

  generarCodigo(codigo: string) {
    this.codigo = codigo;
    this.authForm.get('codigo').setValue('');
  }

  validarCodigo(control: FormControl): {[key: string]: any} | null {
    return control.value !== this.codigo ? { resp: 'El código no coincide' } : null;
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.authService.login(
        this.authForm.value
      ).subscribe(
        (session) => {
          console.log(session);
          Session.start(session);
          this.router.navigate(['/principal/inicio']);
        },
        () => {
          this.authForm.get('username').setErrors({ resp: 'Usuario o contraseña incorrecto.' });
        }
      );
    } else {
      Object.values(this.authForm.controls).forEach(c => c.markAsTouched());
    }
  }

}
