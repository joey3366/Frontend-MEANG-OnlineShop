import { basicAlert } from '@shared/alerts/toasts';
import { IResultRegister } from '@core/interfaces/register.interface';
import { UsersService } from '@core/services/users.service';
import { Component, OnInit } from '@angular/core';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  register: IRegisterForm = {
    name: '',
    lastname: '',
    birthDay: '',
    email: '',
    password: ''
  };
  constructor(private api: UsersService, private router: Router) { }

  ngOnInit(): void {
    const data = new Date();
    data.setFullYear(data.getFullYear() - 18);
    this.register.birthDay = (data.toISOString()).substring(0, 10);
  }
  private formatNumbers(num: number | string){
    return (+num < 10) ? `0${ num }` : num;
  }

  dataAsign($event){
    const fecha = `${$event.year} - ${this.formatNumbers($event.month)} - ${this.formatNumbers($event.day)}`;
    this.register.birthDay = fecha;
  }

  add(){
    this.api.register(this.register).subscribe((result: IResultRegister) => {
      if (!result.status) {
        basicAlert(TYPE_ALERT.WARNING, result.message);
        return;
      }
      basicAlert(TYPE_ALERT.SUCCESS, result.message);
      this.router.navigate(['/login']);
    });
  }
}
