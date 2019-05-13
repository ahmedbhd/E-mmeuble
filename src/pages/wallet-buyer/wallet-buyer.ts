import { Component } from '@angular/core';
import {App, Modal, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {PaymentFormPage} from "../payment-form/payment-form";
import {MbscFormOptions} from "@mobiscroll/angular"; // 1) Import missing classes from Angular

@Component({
  selector: 'page-wallet-buyer',
  templateUrl: 'wallet-buyer.html',
})
export class WalletBuyerPage {
  public account = "";
  public myBalance:number;
  public amount:number;
  public choice = "balance";
  public amountTND:number;
  public balanceTND:number;
  public myModal: Modal;
  public paymentData:any = null;
  composersForm: FormGroup; // 2) Define the interface of our form
  public hideMe: boolean= true;
  public myRadio = 'buy';
  formSettings: MbscFormOptions = {
    theme: 'ios'
  };
  constructor(private navCtrl: NavController,
              private navParams: NavParams ,
              private toastCtrl: ToastController,
              private buyerService: BuyerServiceProvider,
              private formBuilder: FormBuilder,
              private modal: ModalController,
              private appCtrl: App
  ) {
    this.resetRange();

    this.composersForm = this.formBuilder.group({ // 4) Initialize our form
      composer: ['', Validators.required], // 5) Define 'formControlName' inside form
    });
  }

  onChangeHandler(event) {
    // this.navCtrl.pop(); // 6) Removing page from stack
    console.log(event)
  }

  updateBalancePosition($event){
    this.amount = $event.value;
    this.amountTND = this.amount*2;
  }
  changeValue($event){
    this.amountTND =$event.target.value*2;
  }
  exchangeSTT(){
    if (this.paymentData != null) {
      if (this.myRadio =="sell") {
        this.sellSTT();
      } else
        this.buySTT();
    }else{
      this.presentToast("Please choose a payment method.")
    }
  }

  buySTT(){
    if (this.amount !=0) {
      this.buyerService.rechargeAcc(this.account, this.amount).subscribe(data => {
        this.presentToast("Successfully recharged you account");
        this.resetRange();
      }, error1 => this.presentToast("Network Error!"));
    }else
      this.presentToast("You have no STT");
  }

  sellSTT(){
    console.log(this.amount);
    if (this.amount !=0)
      this.buyerService.exchange(this.account,-this.amount).subscribe(
        data => { },
        error1 => this.presentToast("Network Error!"),
        () => {
            this.presentToast("Exchange successful");
            this.resetRange();
    });
    else
      this.presentToast("You have no STT");
  }

  resetRange(){
    this.amountTND=this.amount = 0;
    this.paymentData = null;
  }

  getData(){
    this.buyerService.getMyAccount().subscribe(data => this.account = data);
    this.buyerService.getMyBalance().subscribe(data => {
      this.myBalance = data;
      this.balanceTND = this.myBalance * 2;
    },error1 => this.presentToast("Network Error!"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletBuyerPage');
    this.getData();
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

  refreshPage(refresher){
    this.getData();
    refresher.complete();
  }

  logout(){
    this.appCtrl.getRootNav().pop();
  }

  openPaymentForm() {
    this.hideMe = false;
      this.myModal = this.modal.create(PaymentFormPage, {data: this.paymentData});
      this.myModal.present();
      this.myModal.onDidDismiss( data => {
        if (data != null) {
          console.log(data);
          this.paymentData = data;
          this.presentToast("We thank you for trusting us");
        }
      })

  }
}
