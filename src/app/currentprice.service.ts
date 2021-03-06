import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';

import { AppService } from './app.service';
import { Currentprice } from './currentprice';

@Injectable()
export class CurrentpriceService {
  public currentprice: Observable<Currentprice>;
  public orderHistory: Observable<Currentprice[]>;
  public orderHistoryByMinute: Observable<Currentprice[]>;
  public orderHistoryBy15Minutes: Observable<Currentprice[]>;
  public orderHistoryBy30Minutes: Observable<Currentprice[]>;

  constructor(private http: Http, private appService: AppService) {
    this.currentprice = this.getCurrentprice();
  }

  private getCurrentprice(): Observable<Currentprice> {

    return Observable.create(observer => {
      window.electron.ipcRenderer.on('currentPrice', (e, order) => {
        const preppedOrder = Object.assign({}, order, {
          last: order.close
        });
        observer.next(Currentprice.fromObject(preppedOrder));
      });
      window.electron.ipcRenderer.send('getCurrentPrice');

    });

  }

  getOrderHistoryByMinute() {
    if(!this.orderHistoryByMinute) {
      this.orderHistoryByMinute = Observable.create(observer => {
        window.electron.ipcRenderer.on('orderHistoryByMinute', (e, data) => {

          // Generate test data
          // data = [];
          // const getRandom = (min, max) => Math.random() * (max - min) + min;
          // const now = moment();
          // for(let i = 0; i > -1; i--) {
          //   for(let j = 23; j > -1; j--) {
          //     for(let k = 59; k > -1; k--) {
          //       const time = moment(now.toDate()).subtract(i, 'days').subtract(j, 'hours').subtract(k, 'minutes').toISOString();
          //       const low = getRandom(10, 40);
          //       const high = getRandom(low, 42);
          //       const close = getRandom(low, high);
          //       data.push({
          //         close,
          //         high,
          //         low,
          //         open: data[data.length - 1] ? data[data.length - 1].close : getRandom(10, 42),
          //         time,
          //         volume: getRandom(.1, .5),
          //       });
          //     }
          //   }
          // }

          const preppedData = data
            .map(d => Object.assign({}, d, {
              last: d.close
            }))
            .map(d => Currentprice.fromObject(d));
            // .filter(d => d.high && d.low);

          observer.next(preppedData);
        });
        window.electron.ipcRenderer.send('getOrderHistoryByMinute');
      });
    }
    return this.orderHistoryByMinute;
  }

  getOrderHistoryBy15Minutes() {
    if(!this.orderHistoryBy15Minutes) {
      this.orderHistoryBy15Minutes = Observable.create(observer => {
        window.electron.ipcRenderer.on('orderHistoryBy15Minutes', (e, data) => {

          // Generate test data
          // data = [];
          // const getRandom = (min, max) => Math.random() * (max - min) + min;
          // const now = moment();
          // for(let i = 0; i > -1; i--) {
          //   for(let j = 23; j > -1; j--) {
          //     for(let k = 3; k > -1; k--) {
          //       const time = moment(now.toDate()).subtract(i, 'days').subtract(j, 'hours').subtract(k * 15, 'minutes').toISOString();
          //       const low = getRandom(10, 40);
          //       const high = getRandom(low, 42);
          //       const close = getRandom(low, high);
          //       data.push({
          //         close,
          //         high,
          //         low,
          //         open: data[data.length - 1] ? data[data.length - 1].close : getRandom(10, 42),
          //         time,
          //         volume: getRandom(.1, .5),
          //       });
          //     }
          //   }
          // }

          const preppedData = data
            .map(d => Object.assign({}, d, {
              last: d.close
            }))
            .map(d => Currentprice.fromObject(d));
            // .filter(d => d.high && d.low);

          observer.next(preppedData);
        });
        window.electron.ipcRenderer.send('getOrderHistoryBy15Minutes');
      });
    }
    return this.orderHistoryBy15Minutes;
  }

  getOrderHistoryBy30Minutes() {
    if(!this.orderHistoryBy30Minutes) {
      this.orderHistoryBy30Minutes = Observable.create(observer => {
        window.electron.ipcRenderer.on('orderHistoryBy30Minutes', (e, data) => {

          // Generate test data
          // data = [];
          // const getRandom = (min, max) => Math.random() * (max - min) + min;
          // const now = moment();
          // for(let i = 0; i > -1; i--) {
          //   for(let j = 23; j > -1; j--) {
          //     for(let k = 1; k > -1; k--) {
          //       const time = moment(now.toDate()).subtract(i, 'days').subtract(j, 'hours').subtract(k * 30, 'minutes').toISOString();
          //       const low = getRandom(10, 40);
          //       const high = getRandom(low, 42);
          //       const close = getRandom(low, high);
          //       data.push({
          //         close,
          //         high,
          //         low,
          //         open: data[data.length - 1] ? data[data.length - 1].close : getRandom(10, 42),
          //         time,
          //         volume: getRandom(.1, .5),
          //       });
          //     }
          //   }
          // }

          const preppedData = data
            .map(d => Object.assign({}, d, {
              last: d.close
            }))
            .map(d => Currentprice.fromObject(d));
            // .filter(d => d.high && d.low);

          observer.next(preppedData);
        });
        window.electron.ipcRenderer.send('getOrderHistoryBy30Minutes');
      });
    }
    return this.orderHistoryBy30Minutes;
  }

  getOrderHistory() {
    if(!this.orderHistory) {
      this.orderHistory = Observable.create(observer => {
        window.electron.ipcRenderer.on('orderHistory', (e, data) => {

          // Generate test data
          // data = [];
          // const getRandom = (min, max) => Math.random() * (max - min) + min;
          // const now = moment();
          // for(let i = 0; i > -1; i--) {
          //   for(let j = 23; j > -1; j--) {
          //     for(let k = 59; k > -1; k--) {
          //       const time = moment(now.toDate()).subtract(i, 'days').subtract(j, 'hours').subtract(k, 'minutes').toISOString();
          //       const low = getRandom(10, 40);
          //       const high = getRandom(low, 42);
          //       const close = getRandom(low, high);
          //       data.push({
          //         close,
          //         high,
          //         low,
          //         open: data[data.length - 1] ? data[data.length - 1].close : getRandom(10, 42),
          //         time,
          //         volume: getRandom(.1, .5),
          //       });
          //     }
          //   }
          // }

          const preppedData = data
            .map(d => Object.assign({}, d, {
              last: d.close
            }))
            .map(d => Currentprice.fromObject(d))
            .filter(d => d.high && d.low);

          observer.next(preppedData);
        });
        window.electron.ipcRenderer.send('getOrderHistory');
      });
    }
    return this.orderHistory;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
