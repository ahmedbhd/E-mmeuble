import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ToastController, Slides, LoadingController, PopoverController} from 'ionic-angular';
import {Purchase} from "../../providers/purchase";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {DetailPage} from "../detail/detail";
import {PopoverDescriptionPage} from "../popover-description/popover-description";
import {ContractsListBuyerPage} from "../contracts-list-buyer/contracts-list-buyer";

/**
 * Generated class for the ContractsBuyerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-contracts-buyer',
  templateUrl: 'contracts-buyer.html',
})
export class ContractsBuyerPage {
  public purchaseIndex:any;
  public thisPurchase: Purchase ;
  public hideMe: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private buyerService: BuyerServiceProvider,
              private popOverCtrl: PopoverController
  ) {
    this.resetValues();
  }

  resetValues(){
    this.thisPurchase =  new Purchase(0,"-","-",0,0,"0","0",0,"0","0","0",false,false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractsBuyerPage');
    this.purchaseIndex = this.navParams.get('purchaseIndex');
    this.getPurchaseAt();
  }

  getPurchaseAt( ){
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        showBackdrop: true
      });
      loading.present();
      console.log("inside purchaseAt");
      console.log("line 72 "+this.purchaseIndex);
      this.buyerService.getMyPendingPurchaseAt(this.purchaseIndex).subscribe(data => {
        this.thisPurchase = data;
        console.log(data);
        console.log("line 69 ");
        console.log(this.thisPurchase);
        loading.dismiss();
      },error1 => {
        this.presentToast("Network Error!");
        loading.dismiss();
      })

  }


  confirmPurch(){
    this.buyerService.setPurchaseAsInProgress(this.purchaseIndex,this.thisPurchase.houseIndex).subscribe(data => {
      this.getPurchaseAt();
      this.presentToast("Confirmation success!")
    },error1 => this.presentToast("Network Error!"));
  }

  cancelPurch(){
    let houseIndex = this.thisPurchase.houseIndex;
    this.buyerService.setAsCancelled(houseIndex,this.purchaseIndex).subscribe(data => {
      this.presentToast("cancellation success!")
    },error1 => this.presentToast("Network Error!"),
      ()=> this.navCtrl.pop());
  }

  openDetail($index){
    this.navCtrl.push(DetailPage, {
      houseIndex: $index,
      thisPage: ContractsBuyerPage,
      thisIsFeeds:"no",
      thisIsTheOwner:"no",
      state:5
    });
  }

  private presentPopOver(myEvent,data){
    let popOver = this.popOverCtrl.create(PopoverDescriptionPage, {data}, {cssClass: 'contact-popover'});
    popOver.present({
      ev:myEvent,
      animate: true,
    });
  }

  selectChange(e) {
    console.log(e);
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

  showMe(){
    this.hideMe = !this.hideMe;
  }
}
