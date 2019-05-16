import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {FeedsBuyerPage} from "../feeds-buyer/feeds-buyer";
import {WalletBuyerPage} from "../wallet-buyer/wallet-buyer";
import {ContractsListBuyerPage} from "../contracts-list-buyer/contracts-list-buyer";


@Component({
  selector: 'page-tabs-buyer',
  templateUrl: 'tabs-buyer.html',
})
export class TabsBuyerPage {
  tab1Root = FeedsBuyerPage;
  tab2Root = ContractsListBuyerPage;
  tab3Root = WalletBuyerPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsBuyerPage');
  }

}
