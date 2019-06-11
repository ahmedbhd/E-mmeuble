import {Component} from '@angular/core';
import {App, LoadingController, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {House} from "../../providers/house";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {SortPopOverBuyerPage} from '../sort-pop-over-buyer/sort-pop-over-buyer';
import {DetailsBuyerPage} from "../details-buyer/details-buyer";
import * as firebase from "firebase";

@Component({
  selector: 'page-feeds-buyer',
  templateUrl: 'feeds-buyer.html',
})
export class FeedsBuyerPage {
  public houses: House[];
  public house: House;
  public resultNbr: number = 0;
  private unfilteredHouses: House[];

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , private buyerService: BuyerServiceProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private appCtrl: App,
              private popOverCtrl: PopoverController) {

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad FeedsBuyerPage');
    this.reloadList();
  }

  filterItems(ev: any) {

    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.houses = this.unfilteredHouses.filter((item) => {
        return (item.location.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.reloadList();
    }
  }

  refreshList(refresher) {
    this.buyerService.getHouses().subscribe(
      data => {
        this.unfilteredHouses = this.houses = data;
        this.resultNbr = this.houses.length;
        if (this.resultNbr==0)
          this.presentToast("This list is empty");
        else
          for (let i =0 ; i<this.unfilteredHouses.length;i++){
            this.getPhotoURL(i);
          }
      },
      error1 => {
        refresher.complete();
        this.presentToast("Network Error!");
      },
      () => refresher.complete());
  }

  openDetail($index, $state) {
    this.navCtrl.push(DetailsBuyerPage, {
      indexHouse: $index,
      thisPage: FeedsBuyerPage,
      thisIsFeeds: "yes",
      thisIsTheOwner: "no",
      state: $state
    });
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

  logout() {
    this.appCtrl.getRootNav().pop();
  }

  private presentPopOver(myEvent) {
    let popOver = this.popOverCtrl.create(SortPopOverBuyerPage, {}, {cssClass: 'contact-popover'});
    let ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            top: 100
          };
        }
      }
    };
    popOver.present({
      ev: ev,
      animate: true
    });
    popOver.onDidDismiss(data => {
      if (data != null) {
        console.log(data);
        if (data.filter == "sort") {
          this.sortList(data.sortResult);
        } else {
          this.filterList(data.selectedFilter, data.values);
        }
      }
    })
  }

  private sortList(param: string) {
    console.log(param);
    switch (param) {
      case "rooms": {
        this.houses.sort((a, b) => (a.rooms > b.rooms) ? 1 : ((b.rooms > a.rooms) ? -1 : 0));
        break;
      }
      case "price": {
        this.houses.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
        break;
      }
      case "area": {
        this.houses.sort((a, b) => (parseFloat(a.area) > parseFloat(b.area)) ? 1 : ((parseFloat(b.area) > parseFloat(a.area)) ? -1 : 0));
        break;
      }
    }
  }

  private filterList(param: string, $values) {
    console.log(param);
    console.log($values);
    switch (param) {
      case "rooms": {
        this.houses = this.unfilteredHouses.filter(value => value.rooms >= $values.lower && value.rooms <= $values.upper);
        break;
      }
      case "price": {
        this.houses = this.unfilteredHouses.filter(value => value.price >= $values.lower && value.price <= $values.upper);
        break;
      }
      case "area": {
        console.log("area");
        this.houses = this.unfilteredHouses.filter(value => parseFloat(value.area) >= $values.lower && parseFloat(value.area) <= $values.upper);
        break;
      }
      case "status": {
        console.log("status");
        this.houses = this.unfilteredHouses.filter(value => value.state == parseInt($values));
        break;
      }
    }
  }

  private reloadList() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.buyerService.getHouses().subscribe(data => {
      this.houses = data;
      this.unfilteredHouses = data;
      console.log(this.houses);
      this.resultNbr = this.houses.length;
      if (this.resultNbr==0)
        this.presentToast("This list is empty");
      else
        for (let i =0 ; i<this.unfilteredHouses.length;i++){
          this.getPhotoURL(i);
        }
    }, error1 => {
      this.presentToast("Network Error!");
      loading.dismiss();
    }, () => loading.dismiss());
  }


  getPhotoURL(number : number){
    firebase.storage().ref().child('pictures/'+this.houses[number].image).getDownloadURL().then( url => {
      this.houses[number].image=url;
    }, (err) => {
      return `${err}`;
    })
  }
}
