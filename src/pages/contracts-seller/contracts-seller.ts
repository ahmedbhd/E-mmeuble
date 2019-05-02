import {Component, ViewChild} from '@angular/core';
import {LoadingController, NavController, Slides, ToastController} from 'ionic-angular';
import { SellerServiceProvider } from '../../providers/seller-service/seller-service';
import {Purchase} from "../../providers/purchase";
import {DetailPage} from "../detail/detail";

@Component({
  selector: 'contracts-seller',
  templateUrl: 'contracts-seller.html'
})
export class ContractsSellerPage {
  public thisPurchase: Purchase ;
  public purchasesNbr:number[];
  public numbers:any;
  // public isThereData:string="yes";
  //private emptyContrat = new Purchase(0,"-","-",0,0,"-","-",0,"-","-","-",false,false);
  constructor(public navCtrl: NavController,
              private sellerService: SellerServiceProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController)
  {
    //this.purchase=this.emptyContrat;
    //this.purchases =  new Array<Purchase>();
    this.resetValues();
  }


  @ViewChild(Slides) slides: Slides;

  resetValues(){
    this.purchasesNbr = new Array<number>();
    this.thisPurchase =  new Purchase(0,"-","-",0,0,"-","-",0,"-","-","-",false,false);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad houses-seller');
    this.chargeSlide();
  }
  chargeSlide(){
    this.sellerService.getMyInProgressPurchasesNbr().subscribe(data => {
      this.purchasesNbr = data;
      this.numbers = Array(this.purchasesNbr.length).fill(0).map((x,i)=>i);
      console.log("line 42 ");
      console.log(this.purchasesNbr);
      console.log("line 43 ");
      console.log(data);
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

      this.sellerService.getMyInProgressPurchaseAt(this.purchasesNbr[$index]).subscribe(data => {
        if (data.date!=0) {
          this.thisPurchase = data;
          console.log("line 69 ");
          console.log(this.thisPurchase);
          console.log("line 71 ");
          console.log(data);
        }
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
    this.sellerService.setAsConfirmed(purchaseIndex).subscribe(data => {
      this.chargeSlide();
      this.presentToast("Confirmation success!")
    });
  }
  cancelPurch(){
    let purchaseIndex = this.purchasesNbr[this.slides.getActiveIndex()];
    let houseIndex = this.thisPurchase.houseIndex;
    this.sellerService.setAsCancelled(houseIndex,purchaseIndex).subscribe(data => {
      this.chargeSlide();
      this.presentToast("cancellation success!")
    });
  }
  refreshList(refresher){
   //this.chargeSlide()
    this.resetValues();
    this.sellerService.getMyInProgressPurchasesNbr().subscribe(data => {
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
      thisPage: ContractsSellerPage,
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
