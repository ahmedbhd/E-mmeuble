import { Component } from '@angular/core';
import { NavParams ,ViewController} from 'ionic-angular';
import {House} from "../../providers/house";

/**
 * Generated class for the ModalAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal-add',
  templateUrl: 'modal-add.html',
})
export class ModalAddPage {

  public house:House = new House();
  constructor(public view: ViewController, public navParams: NavParams) {
  }

  closeModal(){
    this.house = new House();
    this.view.dismiss(null);
  }
  applyModal(){
    this.view.dismiss(this.house);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddPage');
  }

}
