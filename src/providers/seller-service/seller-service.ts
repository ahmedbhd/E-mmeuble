import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {House} from "../house";
import {Purchase} from "../purchase";

@Injectable()
export class SellerServiceProvider {
  sellerURL: string = "http://192.168.137.1:3001/";
  clHouseURL: string = "http://192.168.137.1:3000/";

  headers = new HttpHeaders()
    .append("Access-Control-Allow-Origin", "*")
    .append("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT,OPTIONS")
    .append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token, content-type");

  constructor(public http: HttpClient) {
    console.log('Hello SellerServiceProvider Provider');
  }

  exchange(myAccount: string, amount: number): Observable<string> {
    return this.http.post<string>(this.clHouseURL + "exchange", {
      "sender": myAccount,
      "amount": amount
    }, {headers: this.headers});
  }

  getMyAccount(): Observable<string> {
    return this.http.get<string>(this.sellerURL + "getMyAccount", {headers: this.headers});
  }

  getMyBalance(): Observable<number> {
    return this.http.get<number>(this.sellerURL + "getMyBalance", {headers: this.headers});
  }

  getMyHouses(): Observable<House[]> {
    return this.http.get<House[]>(this.sellerURL + "getMyHouses", {headers: this.headers});
  }

  addHouse(description: string, location: string, area: string, rooms: number, price: number) {
    return this.http.post(this.sellerURL + 'addHouse',
      {
        description: description,
        location: location,
        area: area,
        rooms: rooms,
        price: price
      }
      , {headers: this.headers});
  }

  getMyInProgressPurchasesNbr(): Observable<number[]> {
    console.log("get purch nbr");
    return this.http.get<number[]>(this.sellerURL + "getPurchasesNbr", {headers: this.headers});
  }

  getMyInProgressPurchaseAt(index: number): Observable<Purchase> {
    return this.http.post<Purchase>(this.sellerURL + "getMyInProgressPurchaseAt", {"purchaseIndex": index}, {headers: this.headers});
  }

  getMyInProgressPurchaseList(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.sellerURL + "getMyInProgressPurchaseList", {headers: this.headers});
  }

  setAsConfirmed(purchaseIndex, indexHouse) {
    return this.http.post(this.sellerURL + "setConfirmed", {
      "purchaseIndex": purchaseIndex,
      "indexHouse": indexHouse
    }, {headers: this.headers});
  }

  setAsCancelled(indexHouse, indexPurchase,history) {
    return this.http.post(this.sellerURL + "setCanceled", {
      "indexHouse": indexHouse,
      "purchaseIndex": indexPurchase,
      "history":history
    }, {headers: this.headers});
  }

  getHouseDetail(indexHouse): Observable<House> {
    return this.http.post<House>(this.sellerURL + "getHouseAt", {"indexHouse": indexHouse}, {headers: this.headers});
  }

  deleteHouse(indexHouse) {
    return this.http.post(this.sellerURL + "deleteHouse", {"indexHouse": indexHouse}, {headers: this.headers});
  }
  sellHouseAt(indexHouse,history) {
    return this.http.post(this.sellerURL + "sellHouseAt", {"indexHouse": indexHouse,"history":history}, {headers: this.headers});
  }
}
