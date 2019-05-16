import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-popover-description',
  templateUrl: 'popover-description.html',
})
export class PopoverDescriptionPage {
  public details: String = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.details = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverDescriptionPage');
  }

}
