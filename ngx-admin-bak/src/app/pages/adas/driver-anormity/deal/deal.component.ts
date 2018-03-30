import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'deal',
  templateUrl: './deal.component.html',
  styleUrls: ['../driver-anormity.component.scss']
})
export class DealComponent implements OnInit {
  
  @Input() anormityData: any;
  @Output() comparePhotoEmitter = new EventEmitter<any>();
  @Output() photoEmitter = new EventEmitter<any>();
  @Output() chooseEmitter = new EventEmitter<any>();

  constructor() { }
  ngOnInit() { }
  
  viewComparePhoto(anormityData) {
    this.comparePhotoEmitter.emit(anormityData);
  }

  viewPhoto(anormityData) {
    this.photoEmitter.emit(anormityData);
  }

  choose(dealResult: boolean) {
    if (dealResult == true) {
      this.anormityData.DEAL_CONTENT = '同意';
    } else {
      this.anormityData.DEAL_CONTENT = '不同意';
    }
    this.chooseEmitter.emit(dealResult);
  }

  getAnormityDealData() {
    return this.anormityData;
  }
}
