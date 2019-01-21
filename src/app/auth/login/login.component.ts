import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors: any[];

  notifyMsg: string = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.createForm();

    this.activateRoute.params.subscribe((params) => {
      if (params['registered'] === 'success') {
        this.notifyMsg = 'Enregistré(e) avec succès. Vous pouvez maintenant vous connecter';
      }
    })
  }


  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, 
                  Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/rentals']);

      },
      (error) => {
        this.errors = error.error.errors;


      }
    )
  }
}
