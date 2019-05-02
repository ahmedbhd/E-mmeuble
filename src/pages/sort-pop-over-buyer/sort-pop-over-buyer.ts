import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the SortPopOverBuyerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sort-pop-over-buyer',
  templateUrl: 'sort-pop-over-buyer.html',
})
export class SortPopOverBuyerPage {
  public testRadioResult : string;
  public choice: string = "sort";

  public areaValues: any = {
    upper:1000,
    lower:0
  };
  public roomValues: any = {
    upper:10,
    lower:1
  };
  public priceValues: any = {
    upper:10000,
    lower:1
  };

  public selectedFilter: string = "area";

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {
    this.testRadioResult='area';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SortPopOverBuyerPage');
  }

  public applyChoice(){
    let values:any;
    switch (this.selectedFilter) {
      case "area":{
        values = this.areaValues; break;
      }
      case "rooms": {
        values = this.roomValues; break;
      }
      case "price":{
        values = this.priceValues;break;
      }
    }
    let resultFilter: any = {
      filter: this.choice,
      sortResult:this.testRadioResult,
      selectedFilter:this.selectedFilter,
      values:values
    };
    this.viewCtrl.dismiss(resultFilter);
  }
}
