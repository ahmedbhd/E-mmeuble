import { Component } from '@angular/core';
import { NavController ,ModalController,Modal,ModalOptions,ToastController,LoadingController}  from 'ionic-angular';
import {ModalAddPage} from '../modal-add/modal-add';
import { SellerServiceProvider } from '../../providers/seller-service/seller-service';
import {House} from "../../providers/house";
import {DetailPage} from "../detail/detail";

@Component({
  selector: 'houses-seller',
  templateUrl: 'houses-seller.html'
})
export class HousesSellerPage {
  public houses:House[];
  public house: House;
  public resultNbr:number=0;
  public myModal: Modal;
  private myModalOptions:ModalOptions ={
    enableBackdropDismiss:false,
    showBackdrop: false
  };

  constructor(public navCtrl: NavController,
              private sellerService: SellerServiceProvider,
              private modal: ModalController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController
  ) {
    this.house = new House();
  }

  openAddModal(){
    this.myModal = this.modal.create(ModalAddPage,this.myModalOptions);
    this.myModal.present();
    this.myModal.onDidDismiss( data => {
      if (data != null) {
        console.log(data);
        this.house = data;
        this.addHouse(this.house.location,this.house.area,this.house.rooms,this.house.price);
      }
    })
  }

  addHouse (location: string, area: string, rooms: number, price: number){
    this.sellerService.addHouse(location,area,rooms,price).subscribe(data => {
        this.presentToast("Successfully Added new home");
        this.reloadList();
      }
      ,Error => {this.presentToast("failed while adding new home!")});
  }

  refreshList(refresher){
    this.sellerService.getMyHouses().subscribe(data => {
      this.houses = data;
      this.resultNbr = this.houses.length;
    }, error1 => {},() => refresher.complete());
    // this.houses = this.sellerService.getMyHouses();
    // refresher.complete();
  }


  private reloadList(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sellerService.getMyHouses().subscribe(data => {
      this.houses = data;
      console.log(this.houses);
      this.resultNbr = this.houses.length;

    }, error1 => {},() => loading.dismiss());
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad houses-seller');
    this.reloadList();
  }
  openDetail($index){
    this.navCtrl.push(DetailPage, {
      houseIndex: $index,
      thisPage: HousesSellerPage,
      thisIsFeeds:"no",
      thisIsTheOwner:"yes",
      state:5
    });
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
}
