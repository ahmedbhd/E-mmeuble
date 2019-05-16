import {MbscModule} from '@mobiscroll/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HttpClientModule} from '@angular/common/http';

import {WalletSellerPage} from '../pages/wallet-seller/wallet-seller';
import {ContractsSellerPage} from '../pages/contracts-seller/contracts-seller';
import {HousesSellerPage} from '../pages/houses-seller/houses-seller';
import {TabsSeller} from '../pages/tabs-seller/tabs-seller';
import {StartPage} from '../pages/start/start';
import {ModalAddPage} from '../pages/modal-add/modal-add';
import {TabsBuyerPage} from '../pages/tabs-buyer/tabs-buyer';
import {ContractsBuyerPage} from '../pages/contracts-buyer/contracts-buyer';
import {WalletBuyerPage} from '../pages/wallet-buyer/wallet-buyer';
import {FeedsBuyerPage} from '../pages/feeds-buyer/feeds-buyer';
import {SortPopOverBuyerPage} from '../pages/sort-pop-over-buyer/sort-pop-over-buyer';
import {DetailPage} from '../pages/detail/detail';
import {PopoverDescriptionPage} from '../pages/popover-description/popover-description';
import {PaymentFormPage} from '../pages/payment-form/payment-form';
import {ContractsListBuyerPage} from '../pages/contracts-list-buyer/contracts-list-buyer';
import {ContractsListSellerPage} from '../pages/contracts-list-seller/contracts-list-seller';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SellerServiceProvider} from '../providers/seller-service/seller-service';
import {BuyerServiceProvider} from '../providers/buyer-service/buyer-service';

import {IonicStepperModule} from 'ionic-stepper';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DetailsBuyerPage} from "../pages/details-buyer/details-buyer";

@NgModule({
  declarations: [
    MyApp,
    TabsSeller,
    WalletSellerPage,
    HousesSellerPage,
    ContractsSellerPage,
    StartPage,
    ModalAddPage,
    TabsBuyerPage,
    ContractsBuyerPage,
    WalletBuyerPage,
    FeedsBuyerPage,
    SortPopOverBuyerPage,
    DetailPage,
    PopoverDescriptionPage,
    PaymentFormPage,
    ContractsListBuyerPage,
    ContractsListSellerPage,
    DetailsBuyerPage
  ],
  imports: [
    MbscModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp
      //   , {
      //   popoverEnter: 'custom-popover-enter'
      // }
    ),
    IonicStepperModule,
    BrowserAnimationsModule,
    IonicStepperModule,
    IonicStepperModule,
    IonicStepperModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContractsSellerPage,
    HousesSellerPage,
    WalletSellerPage,
    TabsSeller,
    StartPage,
    ModalAddPage,
    TabsBuyerPage,
    ContractsBuyerPage,
    WalletBuyerPage,
    FeedsBuyerPage,
    SortPopOverBuyerPage,
    DetailPage,
    PopoverDescriptionPage,
    PaymentFormPage,
    ContractsListBuyerPage,
    ContractsListSellerPage,
    DetailsBuyerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SellerServiceProvider,
    BuyerServiceProvider
  ]
})
export class AppModule {
}
