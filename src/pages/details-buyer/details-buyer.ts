import {Component, ViewChild} from '@angular/core';
import {LoadingController, Navbar, NavController, NavParams, ToastController} from 'ionic-angular';
import {House} from "../../providers/house";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {ContractsBuyerPage} from "../contracts-buyer/contracts-buyer";
import {ContractsSellerPage} from "../contracts-seller/contracts-seller";

/**
 * Generated class for the DetailsBuyerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-details-buyer',
  templateUrl: 'details-buyer.html',
})
export class DetailsBuyerPage {
  @ViewChild(Navbar) navBar: Navbar;
  backPage: any;
  houseIndex: number;
  public house: House;
  public isTheBackPageFeeds: string = "no";
  public isTheBackPageHouses: string = "no";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private buyerService: BuyerServiceProvider,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
    this.house = new House();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    this.backPage = this.navParams.get('thisPage');

    this.houseIndex = this.navParams.get('houseIndex');
    let feeds = this.navParams.get('thisIsFeeds');
    let status = this.navParams.get('state');
    this.isTheBackPageHouses = this.navParams.get('thisIsTheOwner');
    if (status == 1 && feeds == "yes")
      this.isTheBackPageFeeds = "yes";

    console.log(status);
    if (this.backPage != ContractsBuyerPage && this.backPage != ContractsSellerPage) {
      this.navBar.backButtonClick = () => {
        // you can set a full custom history here if you want
        let pages = [
          {
            page: this.backPage
          }
        ];
        this.navCtrl.setPages(pages);
      };
    }
    this.getHouse();

  }

  getHouse() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.buyerService.getHouseDetail(this.houseIndex).subscribe(
      data => {
        this.house = (data);
      },
      error1 => {
        this.presentToast("Network Error!");
        loading.dismiss();
      }, () => loading.dismiss());
  }

  buyHouse() {
    this.buyerService.setHouseAsWanted(this.houseIndex).subscribe(
      data => this.presentToast("House is set as wanted!"),
      error1 => this.presentToast("Network Error!"),
      () => this.navCtrl.pop());
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

}
