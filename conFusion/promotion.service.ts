import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/delay';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable()
export class PromotionService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHTTPMsgService) { }


  getPromotions(): Observable<Promotion[]> {
    return this.restangular.all('promotions').getList()
      .catch(error => { return error; } );
  }

  getPromotion(id: number):Observable<Promotion> {
    return  this.restangular.one('promotions',id).get()
      .catch(error => { return error; });
  }


  getFeaturedPromotion(): Observable<Promotion> {
    return  this.restangular.all('promotions').getList({featured: true})
      .map(promotions=>promotions[0])
      .catch(error => { return error; });
  }
}

