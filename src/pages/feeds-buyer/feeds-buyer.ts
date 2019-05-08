import { Component } from '@angular/core';
import {LoadingController, PopoverController, NavController, NavParams, ToastController} from 'ionic-angular';
import {House} from "../../providers/house";
import {BuyerServiceProvider} from "../../providers/buyer-service/buyer-service";
import {SortPopOverBuyerPage } from '../sort-pop-over-buyer/sort-pop-over-buyer' ;
import {DetailPage} from "../detail/detail";
/**
 * Generated class for the FeedsBuyerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-feeds-buyer',
  templateUrl: 'feeds-buyer.html',
})
export class FeedsBuyerPage {
  public houses:House[];
  public house: House;
  public resultNbr:number=0;
  constructor(public navCtrl: NavController
              , public navParams: NavParams
              ,private buyerService: BuyerServiceProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private popOverCtrl: PopoverController)
  {

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad FeedsBuyerPage');
    this.reloadList();
  }

  private presentPopOver(myEvent){
    let popOver = this.popOverCtrl.create(SortPopOverBuyerPage, {}, {cssClass: 'contact-popover'});
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: 100
          };
        }
      }
    };
    popOver.present({
      ev:ev,
      animate: true
    });
    popOver.onDidDismiss( data => {
      if (data!=null) {
        console.log(data);
        //this.sortList(data);
        if (data.filter == "sort"){
          this.sortList(data.sortResult);
        }else {
          this.filterList(data.selectedFilter, data.values);
        }
      }
    })
  }
  private sortList(param: string){
    console.log(param);
    switch (param) {
      case "rooms": {
        this.houses.sort((a,b) => (a.rooms > b.rooms) ? 1 : ((b.rooms > a.rooms) ? -1 : 0));
        break;
      }
      case "price":{
        this.houses.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
        break;
      }
      case "area":{
        this.houses.sort((a,b) => (parseFloat(a.area )> parseFloat(b.area)) ? 1 : (( parseFloat(b.area) > parseFloat(a.area)) ? -1 : 0));
        break;
      }
    }
  }

  private filterList(param: string, $values){
    console.log(param);
    console.log($values);
    switch (param) {
      case "rooms": {
        this.houses = this.houses.filter(value => value.rooms>=$values.lower && value.rooms<=$values.upper);
        break;
      }
      case "price":{
        this.houses = this.houses.filter(value => value.price>=$values.lower && value.price<=$values.upper);
        break;
      }
      case "area":{
        console.log("area");
        this.houses = this.houses.filter(value => parseFloat(value.area)>=$values.lower && parseFloat(value.area)<=$values.upper);
        break;
      }
    }
  }

  filterItems(ev: any) {

    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.houses = this.houses.filter((item) => {
        return (item.location.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else {
      this.reloadList();
    }
  }
  private reloadList(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.buyerService.getHouses().subscribe(data => {
      this.houses = data;
      console.log(this.houses);
      this.resultNbr = this.houses.length;

    }, error1 => {
      this.presentToast("Network Error!");
      loading.dismiss();
    },() => loading.dismiss());
  }

  refreshList(refresher){
    this.buyerService.getHouses().subscribe(data => {
      this.houses = data;
      this.resultNbr = this.houses.length;
      refresher.complete();
    });
    // this.houses = this.sellerService.getMyHouses();
    // refresher.complete();
  }
  openDetail($index , $state){
    this.navCtrl.push(DetailPage, {
      houseIndex: $index,
      thisPage: FeedsBuyerPage,
      thisIsFeeds:"yes",
      thisIsTheOwner:"no",
      state:$state
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
