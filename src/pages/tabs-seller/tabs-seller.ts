import { Component } from '@angular/core';

import { WalletSellerPage } from '../wallet-seller/wallet-seller';
import { ContractsSellerPage } from '../contracts-seller/contracts-seller';
import { HousesSellerPage } from '../houses-seller/houses-seller';

@Component({
  templateUrl: 'tabs-seller.html'
})
export class TabsSeller {

  tab1Root = HousesSellerPage;
  tab2Root = ContractsSellerPage;
  tab3Root = WalletSellerPage;

  constructor() {

  }
}
