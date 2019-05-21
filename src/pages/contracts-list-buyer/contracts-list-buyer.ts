import {Component} from '@angular/core';
import {App, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {Purchase} from "../../providers/purchase";
import {ContractsBuyerPage} from "../contracts-buyer/contracts-buyer";


@Component({
  selector: 'page-contracts-list-buyer',
  templateUrl: 'contracts-list-buyer.html',
})
export class ContractsListBuyerPage {
  public purchases: Purchase[];
  private unfilteredHouses: Purchase[];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private buyerService: BuyerServiceProvider,
              private appCtrl: App) {

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ContractsListBuyerPage');
    this.loadData();
  }

  loadData() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.buyerService.getMyPendingPurchaseList().subscribe(data => {
        this.unfilteredHouses = this.purchases = data;
        if (this.unfilteredHouses.length == 0) {
          this.presentToast("This list is empty");
        }
      }, error1 => {
        loading.dismiss();
        this.presentToast("Network Error!");
      },
      () => loading.dismiss());
  }

  refreshList(refresher) {
    this.buyerService.getMyPendingPurchaseList().subscribe(data => {
        this.unfilteredHouses = this.purchases = data;
        if (this.unfilteredHouses.length == 0) {
          this.presentToast("This list is empty");
        }
      }, error1 => {
        refresher.complete();
        this.presentToast("Network Error!");
      },
      () => refresher.complete());
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      cssClass: 'toastClass'
    });
    toast.present();
  }

  openContract(purchaseIndex: number) {
    this.navCtrl.push(ContractsBuyerPage, {
      purchaseIndex: purchaseIndex,
    });
  }

  filterItems(ev: any) {

    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.purchases = this.unfilteredHouses.filter((item) => {
        return (item.houseDesc.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.loadData();
    }
  }

  logout() {
    this.appCtrl.getRootNav().pop();
  }
}
