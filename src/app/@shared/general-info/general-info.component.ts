import { IGeneralInfo } from './general-info.interface';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  @Input() item: IGeneralInfo;
  constructor() { }

  ngOnInit(): void {
  }

}
