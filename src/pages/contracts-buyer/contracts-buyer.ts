import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {Purchase} from "../../providers/purchase";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {DetailsBuyerPage} from "../details-buyer/details-buyer";
import {PopoverDescriptionPage} from "../popover-description/popover-description";
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-contracts-buyer',
  templateUrl: 'contracts-buyer.html',
})
export class ContractsBuyerPage {
  public purchaseIndex: any;
  public thisPurchase: Purchase;
  public hideMe: boolean = false;
  public info: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private buyerService: BuyerServiceProvider,
              private popOverCtrl: PopoverController,
              private alertCtrl: AlertController
  ) {
    this.info = " Upon the confirmation of the owner of this house, If the current buyer doesn't have the requested price/advance " +
      "this purchase will be deleted and the house goes back to being available.\n " +
      "When you have a debt with the bank, you have up to 3 chances to pay your debt or else the house will be frozen.";
    this.resetValues();
  }

  resetValues() {
    this.thisPurchase = new Purchase(0, "-", "-", 0, 0, "0", "0", 0, "0", "0", "0", false, false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractsBuyerPage');
    this.purchaseIndex = this.navParams.get('purchaseIndex');
    this.getPurchaseAt();
  }

  getPurchaseAt() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      showBackdrop: true
    });
    loading.present();
    console.log("inside purchaseAt");
    console.log("line 72 " + this.purchaseIndex);
    this.buyerService.getMyPendingPurchaseAt(this.purchaseIndex).subscribe(data => {
      this.thisPurchase = data;
      console.log(data);
      console.log("line 69 ");
      console.log(this.thisPurchase);
      loading.dismiss();
    }, error1 => {
      this.presentToast("Network Error!");
      loading.dismiss();
    })

  }


  confirmPurch() {
    this.buyerService.setPurchaseAsInProgress(this.purchaseIndex, this.thisPurchase.indexHouse).subscribe(data => {
      this.getPurchaseAt();
      this.presentToast("Confirmation success!")
    }, error1 => this.presentToast("Network Error!"));
  }

  cancelPurch() {
    let houseIndex = this.thisPurchase.indexHouse;
    this.buyerService.setAsCancelled(houseIndex, this.purchaseIndex, this.thisPurchase.history).subscribe(data => {
        this.presentToast("Cancellation success!")
      }, error1 => this.presentToast("Network Error!"),
      () => this.navCtrl.pop());
  }

  openDetail($index) {
    this.navCtrl.push(DetailsBuyerPage, {
      indexHouse: $index,
      thisPage: ContractsBuyerPage,
      thisIsFeeds: "no",
      thisIsTheOwner: "no",
      state: 5
    });
  }

  selectChange(e) {
    console.log(e);
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

  showMe() {
    this.hideMe = !this.hideMe;
  }

  private presentPopOver(myEvent, data) {
    let popOver = this.popOverCtrl.create(PopoverDescriptionPage, {data}, {cssClass: 'contact-popover'});
    popOver.present({
      ev: myEvent,
      animate: true,
    });
  }

  private presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Please Read Carefully',
      subTitle:'We thank for your understanding',
      message: this.info,
      buttons: ['DONE']
    });
    alert.present();
  }
}
