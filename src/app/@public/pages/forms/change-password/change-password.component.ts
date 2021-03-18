import { PasswordService } from '@core/services/password.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  token: string;
  values= {
    password: '',
    passwordTwo: ''
  }
  constructor(private route: ActivatedRoute, private router: Router, private passwordService: PasswordService) {
    this.route.params.subscribe(params =>{
      this.token = params.token
    })
  }

  ngOnInit(): void {
  }

  reset(){
    if (this.values.password !== this.values.passwordTwo) {
      basicAlert(TYPE_ALERT.WARNING, 'Las contraseñas no coinciden');
      return;
    }
    this.passwordService.change(this.token, this.values.password).subscribe(result => {
      if (result.status) {
        basicAlert(TYPE_ALERT.SUCCESS, result.message);
        this.router.navigate(['login']);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message)
    })
  }
}
