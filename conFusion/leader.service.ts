import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';
import 'rxjs/add/operator/catch';

@Injectable()
export class LeaderService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.restangular.all('leaders').getList()
      .catch(error => { return error; } );
   }

  getLeader(id: number): Observable<Leader> {
      return  this.restangular.one('leaders',id).get()
        .catch(error => { return error; } );
    }

  getFeaturedLeader(): Observable<Leader> {
    return  this.restangular.all('leaders').getList({featured: true})
      .map(leaders=>leaders[0])
      .catch(error => { return error; } );
  }

}
