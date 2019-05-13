import { Component,ViewChild  } from '@angular/core';
import {LoadingController, Navbar, NavController, NavParams, ToastController} from 'ionic-angular';
import {House} from "../../providers/house";
import {SellerServiceProvider} from "../../providers/seller-service/seller-service";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";


@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  @ViewChild(Navbar) navBar: Navbar;
  backPage: any;
  houseIndex:number;
  public house:House;
  public isTheBackPageFeeds:string="no";
  public isTheBackPageHouses:string="no";

  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              private sellerService:SellerServiceProvider,
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
    this.navBar.backButtonClick = () => {
      // you can set a full custom history here if you want
      let pages = [
        {
          page: this.backPage
        }
      ];
      this.navCtrl.setPages(pages);
    };
    this.getHouse();

  }

  getHouse(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sellerService.getHouseDetail(this.houseIndex).subscribe(
      data => {
          this.house=(data);
      },
      error1 => {
          this.presentToast("Network Error!");
          loading.dismiss();
    },() => loading.dismiss());
  }

  deleteHouse(){
    this.sellerService.deleteHouse(this.houseIndex).subscribe(
      data => this.presentToast("House deleted!"),
      error1 => this.presentToast("Network Error!"),
      ()=>this.navCtrl.pop());
  }

  buyHouse(){
    this.buyerService.setHouseAsWanted(this.houseIndex).subscribe(
      data => this.presentToast("House is set as wanted!"),
      error1 => this.presentToast("Network Error!"),
      ()=> this.navCtrl.pop());
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

}
