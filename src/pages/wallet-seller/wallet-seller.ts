import { Component } from '@angular/core';
import {NavController, ToastController,App} from 'ionic-angular';
import { SellerServiceProvider } from '../../providers/seller-service/seller-service';
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'wallet-seller',
  templateUrl: 'wallet-seller.html'
})
export class WalletSellerPage {
  public account = "";
  public myBalance:string;
  public amount:number;
  public choice = "balance";
  constructor(private toastCtrl: ToastController,
              private navCtrl: NavController,
              private sellerService: SellerServiceProvider,
              private appCtrl: App)
  {
    this.amount = 0;
  }
  updateBalancePosition($event){
    this.amount = $event.value;
  }

  resetRange(){
    this.amount = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad wallet-seller');
    this.getData();
  }
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'bottom',
      cssClass:'toastClass'
    });
    toast.present();
  }
  refreshPage(refresher){
    this.getData();
    refresher.complete();
  }
  getData(){
    this.sellerService.getMyAccount().subscribe(data => this.account = data);
    this.sellerService.getMyBalance().subscribe(data => this.myBalance = data);
  }

  exchangeSTT(){
    console.log(this.amount);
    if (this.amount !=0)
      this.sellerService.exchange(this.account,this.amount).subscribe(data => {
        this.presentToast("Exchange successful");
        this.amount = 0;
      });
    else
      this.presentToast("You have no STT");
  }
  logout(){
    this.appCtrl.getRootNav().pop();
  }
}
