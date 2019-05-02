import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {House} from "../house";
import {Purchase} from "../purchase";

/*
  Generated class for the BuyerServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BuyerServiceProvider {
  buyerURL: string ="http://192.168.137.1:3002/";
  clHouseURL: string ="http://192.168.137.1:3000/";
  headers = new HttpHeaders()
    .append("Access-Control-Allow-Origin","*")
    .append("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,PUT,OPTIONS")
    .append("Access-Control-Allow-Headers","Origin, Content-Type, X-Auth-Token, content-type");
  constructor(public http: HttpClient) {
    console.log('Hello BuyerServiceProvider Provider');
  }

  getMyAccount() : Observable<string>{
    return this.http.get<string>(this.buyerURL+"getMyAccount",{headers: this.headers});
  }
  exchange(myAccount: string,amount: number) : Observable<string>{
    return this.http.post<string>(this.clHouseURL+"exchange",{"sender":myAccount,"amount":amount},{headers: this.headers});
  }
  getMyBalance() : Observable<number>{
    return this.http.get<number>(this.buyerURL+"getMyBalance",{headers: this.headers});
  }
  rechargeAcc(myAccount: string,amount: number) : Observable<string>{
    return this.http.post<string>(this.clHouseURL+"chargeAcc",{"receiver":myAccount,"amount":amount},{headers: this.headers});
  }
  getHouses() : Observable<House[]>{
    return this.http.get<House[]>(this.buyerURL+"getHouses",{headers: this.headers});
  }

  setHouseAsWanted(homeIndex: number){
    return this.http.post(this.buyerURL+"setWanted",{"houseIndex": homeIndex},{headers: this.headers});
  }
  getMyPendingPurchasesNbr() : Observable<number[]>{
    console.log("get purch nbr");
    return this.http.get<number[]>(this.buyerURL+"getPurchasesNbr",{headers: this.headers});
  }
  getMyPendingPurchaseAt(index:number) : Observable<Purchase>{
    return this.http.post<Purchase>(this.buyerURL+"getMyPendingPurchaseAt",{"purchaseIndex":index},{headers: this.headers});
  }
  setAsConfirmed(index){
    return this.http.post(this.buyerURL+"setConfirmed",{"purchaseIndex":index},{headers: this.headers});
  }
  setAsCancelled(indexHouse,indexPurchase){
    return this.http.post(this.buyerURL+"setCanceled",{"houseIndex":indexHouse,"purchaseIndex":indexPurchase},{headers: this.headers});
  }
  getHouseDetail($houseIndex): Observable<House>{
    return this.http.post<House>(this.buyerURL+"getHouseAt",{"houseIndex":$houseIndex},{headers:this.headers});
  }
}
