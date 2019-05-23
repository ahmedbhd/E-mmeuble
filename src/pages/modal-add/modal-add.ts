import {Component} from '@angular/core';
import {NavParams, ToastController, ViewController} from 'ionic-angular';
import {House} from "../../providers/house";


@Component({
  selector: 'page-modal-add',
  templateUrl: 'modal-add.html',
})
export class ModalAddPage {
  public house: House = new House();

  constructor(public view: ViewController, public navParams: NavParams, private toastCtrl: ToastController) {
    this.house.description = this.house.area = this.house.location = "";
  }

  closeModal() {
    this.house = new House();
    this.view.dismiss(null);
  }

  applyModal() {
    let area = parseFloat(this.house.area);
    if (this.house.description.indexOf("|") > 0 || this.house.location.indexOf("|") > 0)
      this.presentToast("Description or location input contains unrecognized symbol");
    if (this.house.rooms > 10 || this.house.rooms <= 0)
      this.presentToast("Rooms number doesn't look right");
    else if (area > 1000 || area <= 0)
      this.presentToast("House area doesn't look right");
    else if (this.house.area == "" || this.house.rooms == null || this.house.price <= 0 || this.house.price == null || this.house.location == "" || this.house.description == "") {
      this.presentToast("All the details are required");
      console.log(this.house)
    } else
      this.view.dismiss(this.house);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddPage');
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
}
