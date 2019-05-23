import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {House} from "../house";
import {Purchase} from "../purchase";


@Injectable()
export class BuyerServiceProvider {
  buyerURL: string = "http://192.168.137.1:3002/";
  clHouseURL: string = "http://192.168.137.1:3000/";
  headers = new HttpHeaders()
    .append("Access-Control-Allow-Origin", "*")
    .append("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT,OPTIONS")
    .append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token, content-type");

  constructor(public http: HttpClient) {
    console.log('Hello BuyerServiceProvider Provider');
  }

  getMyAccount(): Observable<string> {
    return this.http.get<string>(this.buyerURL + "getMyAccount", {headers: this.headers});
  }

  exchange(myAccount: string, amount: number): Observable<string> {
    return this.http.post<string>(this.clHouseURL + "exchange", {
      "sender": myAccount,
      "amount": amount
    }, {headers: this.headers});
  }

  getMyBalance(): Observable<number> {
    return this.http.get<number>(this.buyerURL + "getMyBalance", {headers: this.headers});
  }

  rechargeAcc(myAccount: string, amount: number): Observable<string> {
    return this.http.post<string>(this.clHouseURL + "chargeAcc", {
      "receiver": myAccount,
      "amount": amount
    }, {headers: this.headers});
  }

  getHouses(): Observable<House[]> {
    return this.http.get<House[]>(this.buyerURL + "getHouses", {headers: this.headers});
  }

  setHouseAsWanted(homeIndex: number, history: string) {
    return this.http.post(this.buyerURL + "setWanted", {
      "indexHouse": homeIndex,
      "history": history
    }, {headers: this.headers});
  }

  getMyPendingPurchasesNbr(): Observable<number[]> {
    console.log("get purch nbr");
    return this.http.get<number[]>(this.buyerURL + "getPurchasesNbr", {headers: this.headers});
  }

  getMyPendingPurchaseAt(index: number): Observable<Purchase> {
    return this.http.post<Purchase>(this.buyerURL + "getMyPendingPurchaseAt", {"purchaseIndex": index}, {headers: this.headers});
  }

  getMyPendingPurchaseList(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.buyerURL + "getMyPendingPurchaseList", {headers: this.headers});
  }

  setPurchaseAsInProgress(purchaseIndex, indexHouse) {
    return this.http.post(this.buyerURL + "setPurchaseAsInProgress", {
      "purchaseIndex": purchaseIndex,
      "indexHouse": indexHouse
    }, {headers: this.headers});
  }

  setAsCancelled(indexHouse, indexPurchase, history) {
    return this.http.post(this.buyerURL + "setCanceled", {
      "indexHouse": indexHouse,
      "purchaseIndex": indexPurchase,
      "history": history
    }, {headers: this.headers});
  }

  getHouseDetail(indexHouse): Observable<House> {
    return this.http.post<House>(this.buyerURL + "getHouseAt", {"indexHouse": indexHouse}, {headers: this.headers});
  }

  rateHouseAt(indexHouse, rate, acc, infos): Observable<string> {
    return this.http.post<string>(this.buyerURL + "rateHouseAt", {
      "indexHouse": indexHouse,
      "rate": rate,
      "infos": infos,
      "account": acc
    }, {headers: this.headers});
  }
}
