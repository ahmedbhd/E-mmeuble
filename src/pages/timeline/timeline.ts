import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {SellerServiceProvider} from "../../providers/seller-service/seller-service";


@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage {
  indexHouse: number;
  public items: any;

  constructor(public navCtrl: NavController,
              private sellerService: SellerServiceProvider,
              private loadingCtrl: LoadingController,
              private view: ViewController,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.items = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimelinePage');
    this.indexHouse = this.navParams.get('data');
    console.log(this.indexHouse);
    this.loadTimeLine();
  }

  closeModal() {
    this.view.dismiss(null);
  }

  loadTimeLine() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sellerService.getHouseDetail(this.indexHouse).subscribe(data => {
        let _tab = data.history.split("|");
        for (let i = 0; i < _tab.length - 1; i++) {
          let _items = _tab[i].split("/");
          this.items.push({
            id: i,
            title: _items[2].toUpperCase(),
            content: 'The owner of the address (' + _items[0] + ') has made the action of "' + _items[2] + '".',
            icon: 'calendar',
            time: _items[1]
          });
        }
      },
      error1 => {
        this.presentToast("Network Error!");
        loading.dismiss();
      }, () => loading.dismiss());
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
