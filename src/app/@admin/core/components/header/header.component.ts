import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
  toggledValue = true;
  @Output() toogleChange = new EventEmitter<boolean>();

  toogle(){
    if (this.toggledValue === undefined) {
      this.toggledValue = true;
    }
    this.toggledValue = !this.toggledValue;
    this.toogleChange.emit(this.toggledValue);
  }
}
