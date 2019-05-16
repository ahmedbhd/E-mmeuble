import { Component } from '@angular/core';

import { WalletSellerPage } from '../wallet-seller/wallet-seller';
import { HousesSellerPage } from '../houses-seller/houses-seller';
import {ContractsListSellerPage} from "../contracts-list-seller/contracts-list-seller";

@Component({
  templateUrl: 'tabs-seller.html'
})
export class TabsSeller {

  tab1Root = HousesSellerPage;
  tab2Root = ContractsListSellerPage;
  tab3Root = WalletSellerPage;

  constructor() {

  }
}
