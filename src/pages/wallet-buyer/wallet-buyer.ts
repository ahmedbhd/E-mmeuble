import { Component } from '@angular/core';
import {App, NavController, NavParams, ToastController} from 'ionic-angular';
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";

/**
 * Generated class for the WalletBuyerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-wallet-buyer',
  templateUrl: 'wallet-buyer.html',
})
export class WalletBuyerPage {
  public account = "";
  public myBalance:number;
  public amount:number;
  public choice = "balance";

  constructor(private navCtrl: NavController,
              private navParams: NavParams ,
              private toastCtrl: ToastController,
              private buyerService: BuyerServiceProvider,
              private appCtrl: App)
  {
    this.amount = 0;
  }
  updateBalancePosition($event){
    this.amount = $event.value;
  }
  exchangeSTT(){
    this.buyerService.rechargeAcc(this.account, this.amount).subscribe(data => {
      this.presentToast("Successfully recharged you account");
      this.amount = 0;
    })
  }
  resetRange(){
    this.amount = 0;
  }

  getData(){
    this.buyerService.getMyAccount().subscribe(data => this.account = data);
    this.buyerService.getMyBalance().subscribe(data => this.myBalance = data);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletBuyerPage');
    this.getData();
  }
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  refreshPage(refresher){
    this.getData();
    refresher.complete();
  }
  logout(){
    this.appCtrl.getRootNav().pop();
  }
}
