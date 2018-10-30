import { Component, OnInit, Input, ViewChild, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import * as math from 'mathjs';

import { naturalSort } from './util';
import { Order } from './order';
import { OrderbookService } from './orderbook.service';
import { OpenordersService } from './openorders.service';
import { TableComponent } from './table/table.component';
import { AppService } from './app.service';
import {NumberFormatPipe} from './pipes/decimal.pipe';
import { PricingService } from './pricing.service';
import { Pricing } from './pricing';
// import {TradehistoryService} from './tradehistory.service';
// import { Trade } from './trade';
// import {CurrentpriceService} from './currentprice.service';

math.config({
  number: 'BigNumber',
  precision: 64
});

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderbookComponent implements OnInit {
  @ViewChild('orderbookTable') public orderbookTable: TableComponent;

  public sections: any[] = [
    {rows: []},
    {rows: []}
  ];
  public symbols:string[] = [];
  // public lastTradePrice = '';
  public spread = '';
  private showSpread = false;
  public priceDecimal = '6';
  public pricing: Pricing;
  public pricingAvailable = false;
  public pricingEnabled = false;

  public ownOrders = new Set();

  constructor(
    private appService: AppService,
    private numberFormatPipe: NumberFormatPipe,
    private orderbookService: OrderbookService,
    private openorderService: OpenordersService,
    private pricingService: PricingService,
    // private tradehistoryService: TradehistoryService,
    // private currentpriceService: CurrentpriceService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {

    const { zone } = this;

    this.appService.marketPairChanges.subscribe((symbols) => {
      zone.run(() => {
        this.symbols = symbols;
      });
    });

    this.orderbookService.getOrderbook()
      // .first()
      .subscribe(orderbook => {
        zone.run(() => {
          const asks = orderbook.asks;
          const bids = orderbook.bids;

          this.showSpread = asks.length === 0 && bids.length === 0 ? false : true;

          this.sections = [
            {rows: asks},
            {rows: bids}
          ];

          let spread;
          if(asks.length > 0 && bids.length > 0) {
            const bestAsk = Number(asks[asks.length - 1][0]);
            const bestBid = Number(bids[0][0]);
            spread = String(math.subtract(bestAsk, bestBid));
          } else {
            spread = '';
          }
          this.spread = spread;

          this.orderbookTable.scrollToMiddle();
        });
      });

    this.orderbookService.getPriceDecimal()
      .subscribe(priceDecimal => {
        this.zone.run(() => {
          this.priceDecimal = priceDecimal;
        });
      });

    this.pricingService.getPricing().subscribe(pricing => {
      zone.run(() => {
        this.pricing = pricing;
        this.pricingAvailable = pricing.enabled;
      });
    });
    this.pricingService.getPricingEnabled().subscribe(enabled => {
      zone.run(() => {
        this.pricingEnabled = enabled;
      });
    });

    this.openorderService.getOpenorders().subscribe(openorders => {
      zone.run(() => {
        this.ownOrders = new Set(openorders.map(o => o.id));
      });
    });

    // this.currentpriceService.currentprice.subscribe((cp) => {
    //   zone.run(() => {
    //     this.lastTradePrice = cp.last;
    //   });
    // });

  }

  onRowSelect(row) {
    if (row) {
      if(this.ownOrders.has(row[2])) {
        const newRow = [...row];
        newRow[2] = '';
        this.orderbookService.requestOrder(newRow);
        setTimeout(() => {
          alert('Unable to take own order.');
        }, 100);
      } else {
        this.orderbookService.requestOrder(row);
      }
    }
  }

  calculateTotal(row) {
    return math.round(math.multiply(row[1], row[0]), 6);
  }

}
