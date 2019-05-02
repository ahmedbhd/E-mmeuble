import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {TRIPS} from "./mock-trips";
import {Observable} from "rxjs";
import {House} from "../house";
import {Purchase} from "../purchase";

@Injectable()
export class SellerServiceProvider {

  sellerURL: string ="http://192.168.111.49:3001/";
  headers = new HttpHeaders()
    .append("Access-Control-Allow-Origin","*")
    .append("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,PUT,OPTIONS")
    .append("Access-Control-Allow-Headers","Origin, Content-Type, X-Auth-Token, content-type");

  constructor(public http: HttpClient) {
    console.log('Hello SellerServiceProvider Provider');
  }

  // getItem(id) {
  //   for (var i = 0; i < this.houses.length; i++) {
  //     if (this.houses[i].id === parseInt(id)) {
  //       return this.houses[i];
  //     }
  //   }
  //   return null;
  // }

  getMyAccount() : Observable<string>{
    return this.http.get<string>(this.sellerURL+"getMyAccount",{headers: this.headers});
  }

  getMyBalance() : Observable<string>{
    return this.http.get<string>(this.sellerURL+"getMyBalance",{headers: this.headers});
  }
  getMyHouses() : Observable<House[]>{
    return this.http.get<House[]>(this.sellerURL+"getMyHouses",{headers: this.headers});
  }

  addHouse(location: string, area: string, rooms: number,price: number){
    return this.http.post(this.sellerURL + 'addHouse',
      {
        location:location,
        area: area,
        rooms:rooms,
        price:price
      }
      ,{ headers: this.headers});
  }
  getMyInProgressPurchasesNbr() : Observable<number[]>{
    console.log("get purch nbr");
    return this.http.get<number[]>(this.sellerURL+"getPurchasesNbr",{headers: this.headers});
  }
  getMyInProgressPurchaseAt(index:number) : Observable<Purchase>{
    return this.http.post<Purchase>(this.sellerURL+"getMyInProgressPurchaseAt",{"purchaseIndex":index},{headers: this.headers});
  }
  setAsConfirmed(index){
    return this.http.post(this.sellerURL+"setConfirmed",{"purchaseIndex":index},{headers: this.headers});
  }
  setAsCancelled(indexHouse,indexPurchase){
    return this.http.post(this.sellerURL+"setCanceled",{"houseIndex":indexHouse,"purchaseIndex":indexPurchase},{headers: this.headers});
  }
  getHouseDetail($houseIndex): Observable<House>{
    return this.http.post<House>(this.sellerURL+"getHouseAt",{"houseIndex":$houseIndex},{headers:this.headers});
  }
  deleteHouse($houseIndex){
    return this.http.post(this.sellerURL+"deleteHouse",{"houseIndex":$houseIndex},{headers:this.headers});
  }
}
