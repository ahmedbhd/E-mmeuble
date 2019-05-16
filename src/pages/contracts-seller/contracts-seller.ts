import {Component, ViewChild} from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController, Slides, ToastController} from 'ionic-angular';
import { SellerServiceProvider } from '../../providers/seller-service/seller-service';
import {Purchase} from "../../providers/purchase";
import {DetailPage} from "../detail/detail";
import {PopoverDescriptionPage} from "../popover-description/popover-description";

@Component({
  selector: 'contracts-seller',
  templateUrl: 'contracts-seller.html'
})
export class ContractsSellerPage {
  public purchaseIndex:any;
  public thisPurchase: Purchase ;
  public hideMe: boolean = false;
  private buyerAndSellerConfir: boolean=false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              private sellerService: SellerServiceProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private popOverCtrl: PopoverController)
  {

    this.resetValues();
  }

  private resetValues(){
    this.thisPurchase =  new Purchase(0,"-","-",0,0,"-","0",0,"0","0","0",false,false);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad houses-seller');
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
      this.sellerService.getMyInProgressPurchaseAt(this.purchaseIndex).subscribe(data => {
        if (data.date!=0) {
          this.thisPurchase = data;
          this.buyerAndSellerConfir = this.thisPurchase.buyerConfirmation && !this.thisPurchase.sellerConfirmation;
          console.log(data);
          console.log("line 69 ");
          console.log(this.thisPurchase);
        }
        loading.dismiss();
      },error1 => {
        this.presentToast("Network Error!");
        loading.dismiss();
      });
  }


  confirmPurch(){
    this.sellerService.setAsConfirmed(this.purchaseIndex,this.thisPurchase.houseIndex).subscribe(data => {
      this.getPurchaseAt();
      this.presentToast("Confirmation success!")
    },error1 => this.presentToast("Network Error!"));
  }

  cancelPurch(){
    let houseIndex = this.thisPurchase.houseIndex;
    this.sellerService.setAsCancelled(houseIndex,this.purchaseIndex).subscribe(
      data => {},
        error1 => this.presentToast("Network Error!"),
        ()=> {
          this.presentToast("cancellation success!");
          this.navCtrl.pop();
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

  showMe(){
    this.hideMe = !this.hideMe;
  }
}
