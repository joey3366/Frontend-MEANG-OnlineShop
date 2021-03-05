import { UsersService } from '@core/services/users.service';
import { ApiService } from './../../../../../@graphql/services/api.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService, private auth: AuthService, private usersApi: UsersService){ }

  ngOnInit(): void {
    this.usersApi.getUsers(1,1).subscribe(result =>{
      console.log(result);
    })
  }


}
