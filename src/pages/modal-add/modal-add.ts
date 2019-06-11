import {Component} from '@angular/core';
import {LoadingController, NavParams, Platform, ToastController, ViewController} from 'ionic-angular';
import {House} from "../../providers/house";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {storage} from "firebase";


@Component({
  selector: 'page-modal-add',
  templateUrl: 'modal-add.html',
})
export class ModalAddPage {
  stream: MediaStream;

  public house: House = new House();
  imageCode:any;
  _pictureReady: boolean = false;
  private loading: any;
  options: CameraOptions = {
    quality: 50,
    targetHeight: 600,
    targetWidth: 600,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(public view: ViewController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private camera:Camera,
              public platform: Platform)
  {
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
    } else if (!this._pictureReady){
      this.presentToast("An image of the house is essential");
    }
    else{
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.addPictureToFirebase();
    }

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




  // async takePicture() {
  //   try {
  //     const options: CameraOptions = {
  //       quality: 50,
  //       targetHeight: 600,
  //       targetWidth: 600,
  //       destinationType: this.camera.DestinationType.DATA_URL,
  //       encodingType: this.camera.EncodingType.JPEG,
  //       mediaType: this.camera.MediaType.PICTURE,
  //       correctOrientation: true
  //     };
  //     const result = await this.camera.getPicture(options);
  //
  //     this.loadImg(`data:image/jpeg;base64,${result}`);
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }
  private getPictureMedia(){
    if (this.platform.is('cordova')) {
      this.takePicture();
    }
  }

  cancelTakePicture() {
    if (this.stream) this.stream.getTracks().forEach(track => track.stop());
    document.getElementById('camera-browser').style.display = 'none';
    document.getElementById('task-description').style.display = 'unset';
  }


  takePicture(){
    this.camera.getPicture(this.options).then((imageData) => {
      this.imageCode= `data:image/jpeg;base64,${imageData}`;
      this._pictureReady = true;
      return this.imageCode
    }, (err) => {
      return `${err}`;
    }).then(res =>  this.loadImageNative(res));
  }
  addPictureToFirebase() {
      let date = new Date();
      this.house.image=date.getTime()+"";
      const picture = storage().ref('pictures/' + date.getTime());

      picture.putString(this.imageCode, 'data_url').then( data => {
        this.loading.dismiss();
        this.view.dismiss(this.house);
      });

  }

  getPictureLibrary() {
    if (this.platform.is('cordova')) {
       this.nativeGetPictureLibrary();
    }
  }
  private nativeGetPictureLibrary() {
    this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.getPictureMedia();
  }


  private loadImageNative(_img: string){
    return new Promise(resolve => {
      const img = new Image;
      const canvas: any = document.getElementById('picture');
      img.onload = _ => {
        canvas.getContext("2d").drawImage(img, 0, 0, 300, 300);
      };
      img.src = _img;
      resolve(_img);
    });
  }


}
