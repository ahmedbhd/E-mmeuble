export class Purchase {
  public purchaseIndex: number;
  public ref: string;
  public owner: string;
  public buyer: string;
  public bank: number;
  public insurance: number;
  public indexHouse: string;
  public houseDesc: string;
  public history: string;
  public loan: string;
  public date: number;
  public advance: string;
  public amountPerMonthForBank: string;
  public amountPerMonthForInsurance: string;
  public sellerConfirmation: boolean;
  public buyerConfirmation: boolean;

  constructor($index, $owner, $buyer, $bank, $insurance, $house, $loan, $date, $advance, $forbank, $forins, $sc, $bc) {
    this.indexHouse = $index;
    this.owner = $owner;
    this.buyer = $buyer;
    this.bank = $bank;
    this.insurance = $insurance;
    this.indexHouse = $house;
    this.loan = $loan;
    this.date = $date;
    this.advance = $advance;
    this.amountPerMonthForBank = $forbank;
    this.amountPerMonthForInsurance = $forins;
    this.sellerConfirmation = $sc;
    this.buyerConfirmation = $bc;
  }
}
