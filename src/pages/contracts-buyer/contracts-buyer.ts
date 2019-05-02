import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams,ToastController,Slides,LoadingController } from 'ionic-angular';
import {Purchase} from "../../providers/purchase";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {DetailPage} from "../detail/detail";

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
  public thisPurchase: Purchase ;
  public purchasesNbr:number[];
  public numbers:any;
  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private buyerService: BuyerServiceProvider) {
    this.resetValues();

  }


  @ViewChild(Slides) slides: Slides;

  resetValues(){
    this.purchasesNbr = new Array<number>();
    this.thisPurchase =  new Purchase(0,"-","-",0,0,"-","-",0,"-","-","-",false,false);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractsBuyerPage');
    this.chargeSlide();
  }
  chargeSlide(){
    this.buyerService.getMyPendingPurchasesNbr().subscribe(data => {
      this.purchasesNbr = data;
      this.numbers = Array(this.purchasesNbr.length).fill(0).map((x,i)=>i);
      console.log("line 42 "+this.purchasesNbr);
      console.log("line 43 "+data);
      if (this.purchasesNbr.length>0) {
        // this.isThereData = "yes";
        this.getPurchaseAt(0);
      }else {
        // this.isThereData="no";
        this.presentToast("There are no contracts for you!");
      }
    });
    // this.houses = this.sellerService.getAll();
    // loading.dismiss();
  }
  getPurchaseAt($index ){

    let currentIndex = this.slides.getActiveIndex();

    if (this.purchasesNbr[$index]!=null) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        showBackdrop: true
      });
      loading.present();
      console.log("inside purchaseAt");
      console.log("line 72 "+this.purchasesNbr[$index]);
      this.buyerService.getMyPendingPurchaseAt(this.purchasesNbr[$index]).subscribe(data => {
        this.thisPurchase = data;
        console.log("line 76 "+this.thisPurchase);
        console.log("line 78 "+data);

        loading.dismiss();
      })
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    this.getPurchaseAt(currentIndex)
  }

  confirmPurch(){
    let purchaseIndex = this.purchasesNbr[this.slides.getActiveIndex()];
    this.buyerService.setAsConfirmed(purchaseIndex).subscribe(data => {
      this.chargeSlide();
      this.presentToast("Confirmation success!")
    });
  }
  cancelPurch(){
    let purchaseIndex = this.purchasesNbr[this.slides.getActiveIndex()];
    let houseIndex = this.thisPurchase.houseIndex;
    this.buyerService.setAsCancelled(houseIndex,purchaseIndex).subscribe(data => {
      this.chargeSlide();
      this.presentToast("cancellation success!")
    });
  }
  refreshList(refresher){
    //this.chargeSlide()
    this.resetValues();
    this.buyerService.getMyPendingPurchasesNbr().subscribe(data => {
      this.purchasesNbr = data;
      this.numbers = Array(this.purchasesNbr.length).fill(0).map((x,i)=>i);
      console.log(this.purchasesNbr);
      if (this.purchasesNbr.length>0)
        this.getPurchaseAt(0 );
      else {
        this.resetValues();
        this.presentToast("There are no contracts for you!");
      }
      refresher.complete();
    });
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
