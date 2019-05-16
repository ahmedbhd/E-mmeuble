import { Component } from '@angular/core';
import {NavController, ToastController, App, ModalController, Modal} from 'ionic-angular';
import { SellerServiceProvider } from '../../providers/seller-service/seller-service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentFormPage} from "../payment-form/payment-form";

@Component({
  selector: 'wallet-seller',
  templateUrl: 'wallet-seller.html'
})
export class WalletSellerPage {
  public account = "";
  public myBalance:number;
  public amount:number;
  public choice = "balance";
  public amountTND:number;
  public balanceTND:number;
  composersForm: FormGroup; // 2) Define the interface of our form
  public paymentData:any = null;
  public myModal: Modal;
  public hideMe: boolean= true;

  constructor(private toastCtrl: ToastController,
              private navCtrl: NavController,
              private sellerService: SellerServiceProvider,
              private formBuilder: FormBuilder,
              private modal: ModalController,
              private appCtrl: App)
  {
    this.composersForm = this.formBuilder.group({ // 4) Initialize our form
      composer: ['', Validators.required], // 5) Define 'formControlName' inside form
    });
    this.resetRange();
  }

  updateBalancePosition($event){
    this.amount = $event.value;
    this.amountTND = this.amount*2;

  }

  resetRange(){
    this.amountTND=this.amount = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad wallet-seller');
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

  getData(){
    this.sellerService.getMyAccount().subscribe(data => this.account = data);
    this.sellerService.getMyBalance().subscribe(data => {
      this.myBalance = data;
      this.balanceTND = this.myBalance * 2;
    },error1 => this.presentToast("Network Error!"));
  }

  exchangeSTT(){
    console.log(this.amount);
    if (this.paymentData != null) {
      if (this.amount != 0)
        this.sellerService.exchange(this.account, this.amount).subscribe(data => {},
            error1 => this.presentToast("Network Error!"),
            () => {
                this.presentToast("Exchange successful");
                this.resetRange();
      });
      else
        this.presentToast("You have no STT");
    }else{
      this.presentToast("Please choose a payment method.")
    }
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

  logout(){
    this.appCtrl.getRootNav().pop();
  }

  changeValue($event){
    this.amountTND =$event.target.value*2;
  }
}
