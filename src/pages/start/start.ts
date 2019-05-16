import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {TabsSeller} from '../tabs-seller/tabs-seller'
import {TabsBuyerPage} from "../tabs-buyer/tabs-buyer";

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  startSellerApp() {
    this.navCtrl.push(TabsSeller);
  }

  startBuyerApp() {
    this.navCtrl.push(TabsBuyerPage);
  }
}
