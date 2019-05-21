import {Component} from '@angular/core';
import {App, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SellerServiceProvider} from "../../providers/seller-service/seller-service";
import {Purchase} from "../../providers/purchase";
import {ContractsSellerPage} from "../contracts-seller/contracts-seller";

@Component({
  selector: 'page-contracts-list-seller',
  templateUrl: 'contracts-list-seller.html',
})
export class ContractsListSellerPage {
  public purchases: Purchase[];
  public state: number = 0;
  private unfilteredHouses: Purchase[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private sellerService: SellerServiceProvider,
              private appCtrl: App) {

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ContractsListSellerPage');
    this.loadData();
  }

  loadData() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sellerService.getMyInProgressPurchaseList().subscribe(data => {
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
    this.sellerService.getMyInProgressPurchaseList().subscribe(data => {
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
    this.navCtrl.push(ContractsSellerPage, {
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
