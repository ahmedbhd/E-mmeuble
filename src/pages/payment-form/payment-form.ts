import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { mobiscroll, MbscDatetimeOptions, MbscFormOptions } from '@mobiscroll/angular';

mobiscroll.settings = {
  lang: 'en',
  theme: 'ios'
};
@Component({
  selector: 'page-payment-form',
  templateUrl: 'payment-form.html',
})
export class PaymentFormPage {
  mobile: Date;

  // mobileSettings: MbscDatetimeOptions = {
  //   display: 'bubble'
  // };
  //
  // desktopSettings: MbscDatetimeOptions = {
  //   display: 'bubble',
  //   touchUi: false
  // };
  //
  // formSettings: MbscFormOptions = {
  //   inputStyle: 'box'
  // };

  public data:any = {
    name: "",
    card: "",
    code: "",
    date: "",
  };
  public form: FormGroup;
  public today:string;
  public future:string;


  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              private navParams: NavParams,
              private view: ViewController,
              private formBuild: FormBuilder
  ) {

    let date = new Date();

    var mm = date.getMonth()+1;
    var m;
    const yyyy = date.getFullYear();

    if(mm<10)
    {
      m='0'+mm;
    }
    this.today = `${yyyy}-${m}`;
    this.future = `${yyyy+10}-${m}`;

    this.form = formBuild.group({
      'name': ['', Validators.required],
      'card':['', Validators.compose([Validators.minLength(16),Validators.maxLength(16), Validators.pattern('[0-9]*'), Validators.required])],
      'code': ['', Validators.compose([Validators.minLength(3),Validators.maxLength(3), Validators.pattern('[0-9]*'), Validators.required])]
    });
    let paymentData = this.navParams.get('data');
    console.log(paymentData);
    if (paymentData!=null){
      this.data.name = paymentData.name;
      this.data.card = paymentData.card;
      this.data.code = paymentData.code;
      this.data.date = paymentData.date;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentFormPage');
  }

  applyModal(){
    if (this.data.date =="")
      this.presentToast("The expiration date is required");
    else
      this.view.dismiss(this.data);
  }

  closeModal(){
    this.view.dismiss(null);
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
