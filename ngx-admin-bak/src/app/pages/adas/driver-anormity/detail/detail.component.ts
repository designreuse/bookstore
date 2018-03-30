import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DriverAnormityComponent } from '../driver-anormity.component';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['../driver-anormity.component.scss']
})
export class DetailComponent implements OnInit {

  @Input() anormityData: any;
  @Output() comparePhotoEmitter = new EventEmitter<any>();
  @Output() photoEmitter = new EventEmitter<any>();

  constructor() { }
  ngOnInit() { }

  viewComparePhoto(anormityData) {
    this.comparePhotoEmitter.emit(anormityData);
  }
  
  viewPhoto(anormityData) {
    this.photoEmitter.emit(anormityData);
  }
}
