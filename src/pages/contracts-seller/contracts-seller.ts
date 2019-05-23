import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {SellerServiceProvider} from '../../providers/seller-service/seller-service';
import {Purchase} from "../../providers/purchase";
import {DetailPage} from "../detail/detail";
import {PopoverDescriptionPage} from "../popover-description/popover-description";

@Component({
  selector: 'contracts-seller',
  templateUrl: 'contracts-seller.html'
})
export class ContractsSellerPage {
  public purchaseIndex: any;
  public thisPurchase: Purchase;
  public hideMe: boolean = false;
  public info: string;
  private buyerAndSellerConfir: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private sellerService: SellerServiceProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private popOverCtrl: PopoverController) {
    this.info = "Upon the confirmation of the owner of this house, If the current buyer doesn't have the requested price/advance this purchase will be deleted and the house goes back to being available. We thank you for your understanding.";
    this.resetValues();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad houses-seller');
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
    this.sellerService.getMyInProgressPurchaseAt(this.purchaseIndex).subscribe(data => {
      if (data.date != 0) {
        this.thisPurchase = data;
        this.buyerAndSellerConfir = this.thisPurchase.buyerConfirmation && !this.thisPurchase.sellerConfirmation;
        console.log(data);
        console.log("line 69 ");
        console.log(this.thisPurchase);
      }
      loading.dismiss();
    }, error1 => {
      this.presentToast("Network Error!");
      loading.dismiss();
    });
  }

  confirmPurch() {
    this.sellerService.setAsConfirmed(this.purchaseIndex, this.thisPurchase.indexHouse).subscribe(data => {
      this.getPurchaseAt();
      this.presentToast("Confirmation success!")
    }, error1 => this.presentToast("Network Error!"));
  }

  cancelPurch() {
    let houseIndex = this.thisPurchase.indexHouse;
    this.sellerService.setAsCancelled(houseIndex, this.purchaseIndex, this.thisPurchase.history).subscribe(
      data => {
      },
      error1 => this.presentToast("Network Error!"),
      () => {
        this.presentToast("Cancellation success!");
        this.navCtrl.pop();
      });
  }

  openDetail($index) {
    this.navCtrl.push(DetailPage, {
      indexHouse: $index,
      thisPage: ContractsSellerPage,
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

  private resetValues() {
    this.thisPurchase = new Purchase(0, "-", "-", 0, 0, "-", "0", 0, "0", "0", "0", false, false);
  }

  private presentPopOver(myEvent, data) {
    let popOver = this.popOverCtrl.create(PopoverDescriptionPage, {data}, {cssClass: 'contact-popover'});
    popOver.present({
      ev: myEvent,
      animate: true,
    });
  }
}
