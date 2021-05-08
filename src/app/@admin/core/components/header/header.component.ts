import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  toggledValue = true;
  @Output() toogleChange = new EventEmitter<boolean>();
  userLabel: string;
  constructor(private authService: AuthService, private router: Router){
    this.authService.accessVar$.subscribe((result) => {
      if (!result.status) {
        this.router.navigate(['/']);
        return;
      }
      this.userLabel = `${result.user?.name} ${result.user?.lastname}`
    })
  }
  ngOnInit() {
    this.authService.start()
  }

  async logOut(){
    this.authService.resetSession();
  }

  toogle(){
    if (this.toggledValue === undefined) {
      this.toggledValue = true;
    }
    this.toggledValue = !this.toggledValue;
    this.toogleChange.emit(this.toggledValue);
  }
}
