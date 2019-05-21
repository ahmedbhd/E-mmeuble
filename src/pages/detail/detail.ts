import {Component, ViewChild} from '@angular/core';
import {
  Events,
  LoadingController,
  ModalController,
  Navbar,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {House} from "../../providers/house";
import {SellerServiceProvider} from "../../providers/seller-service/seller-service";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {ContractsBuyerPage} from "../contracts-buyer/contracts-buyer";
import {ContractsSellerPage} from "../contracts-seller/contracts-seller";
import {TimelinePage} from "../timeline/timeline";


@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  @ViewChild(Navbar) navBar: Navbar;
  backPage: any;
  indexHouse: number;
  public house: House;
  public isTheBackPageFeeds: string = "no";
  public isTheBackPageHouses: string = "no";
  public rating:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private sellerService: SellerServiceProvider,
              private buyerService: BuyerServiceProvider,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private modal: ModalController,
              public events: Events) {
    this.house = new House();
    events.subscribe('star-rating:changed', (starRating) => {console.log(starRating)});

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    this.backPage = this.navParams.get('thisPage');

    this.indexHouse = this.navParams.get('indexHouse');
    let feeds = this.navParams.get('thisIsFeeds');
    let status = this.navParams.get('state');
    this.isTheBackPageHouses = this.navParams.get('thisIsTheOwner');
    if (status == 1 && feeds == "yes")
      this.isTheBackPageFeeds = "yes";

    console.log(status);
    console.log(this.indexHouse );
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
    this.sellerService.getHouseDetail(this.indexHouse).subscribe(
      data => {
        this.house = (data);
        this.showRating();
      },
      error1 => {
        this.presentToast("Network Error!");
        loading.dismiss();
      }, () => loading.dismiss());
  }

  deleteHouse() {
    this.sellerService.deleteHouse(this.indexHouse).subscribe(
      data => this.presentToast("House deleted!"),
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

  showRating(){
    let _reviewTab = this.house.review.split("/");
    let _rate = parseFloat(_reviewTab[0]);
    if (_rate ==0)
      this.rating = _rate;
  }

  openTimeLine() {
    let myModal = this.modal.create(TimelinePage, {data: this.house.indexHouse});
    myModal.present();
  }

  saleHouse() {
    console.log(this.house.history);
    this.sellerService.sellHouseAt(this.indexHouse,this.house.history).subscribe(
      data => this.presentToast("House has been put for sale"),
      error1 => this.presentToast("Network Error!"),
      () => this.navCtrl.pop());
  }
}
