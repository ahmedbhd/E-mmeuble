import { Component } from '@angular/core';
import {NavController, ToastController,App} from 'ionic-angular';
import { SellerServiceProvider } from '../../providers/seller-service/seller-service';

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
  exchangeSTT(){
    this.amount = 0;
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
      duration: 2000
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

  logout(){
    this.appCtrl.getRootNav().pop();
  }
}
