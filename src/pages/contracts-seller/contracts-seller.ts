import {Component, ViewChild} from '@angular/core';
import {LoadingController, NavController, PopoverController, Slides, ToastController} from 'ionic-angular';
import { SellerServiceProvider } from '../../providers/seller-service/seller-service';
import {Purchase} from "../../providers/purchase";
import {DetailPage} from "../detail/detail";
import IonicStepperModule, {IonicStepperComponent} from "ionic-stepper";
import {PopoverDescriptionPage} from "../popover-description/popover-description";

@Component({
  selector: 'contracts-seller',
  templateUrl: 'contracts-seller.html'
})
export class ContractsSellerPage {
  public thisPurchase: Purchase ;
  public purchasesNbr:number[];
  public numbers:any;
  public buyerAndSellerConfir:boolean=false;
  // public isThereData:string="yes";
  //private emptyContrat = new Purchase(0,"-","-",0,0,"-","-",0,"-","-","-",false,false);
  constructor(public navCtrl: NavController,
              private sellerService: SellerServiceProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private popOverCtrl: PopoverController)
  {
    //this.purchase=this.emptyContrat;
    //this.purchases =  new Array<Purchase>();
    this.resetValues();
  }


  @ViewChild(Slides) slides: Slides;

  private resetValues(){
    this.purchasesNbr = new Array<number>();
    this.thisPurchase =  new Purchase(0,"-","-",0,0,"-","-",0,"-","-","-",false,false);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad houses-seller');
    this.chargeSlide();
  }
  chargeSlide(){
    this.resetValues();
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
          this.buyerAndSellerConfir = this.thisPurchase.buyerConfirmation && !this.thisPurchase.sellerConfirmation;
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
    this.sellerService.setAsConfirmed(purchaseIndex,this.thisPurchase.houseIndex).subscribe(data => {
      this.chargeSlide();
      this.presentToast("Confirmation success!")
    });
  }
  cancelPurch(){
    let purchaseIndex = this.purchasesNbr[this.slides.getActiveIndex()];
    let houseIndex = this.thisPurchase.houseIndex;
    this.sellerService.setAsCancelled(houseIndex,purchaseIndex).subscribe(data => {

    },error1 => {},()=> {
      this.resetSlides();
      this.presentToast("cancellation success!")
    });
  }
  resetSlides(){
    this.resetValues();
    this.sellerService.getMyInProgressPurchasesNbr().subscribe(data => {
      this.purchasesNbr = data;
      this.numbers = Array(this.purchasesNbr.length).fill(0).map((x,i)=>i);
      console.log("line 42 ");
      console.log(this.purchasesNbr);
      console.log("line 43 ");
      console.log(data);
      if (this.purchasesNbr.length>0) {
        // this.isThereData = "yes";
        this.slides.slideTo(0);

      }else {
        // this.isThereData="no";
        this.presentToast("There are no contracts for you!");
      }
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

  selectChange(e) {
    console.log(e);
  }
  goTo($stepper){

    console.log($stepper)
  }
  private presentPopOver(myEvent,data){
    let popOver = this.popOverCtrl.create(PopoverDescriptionPage, {data}, {cssClass: 'contact-popover'});
    popOver.present({
      ev:myEvent,
      animate: true,
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
