import { Injectable } from '@angular/core';
import {Feedback} from '../shared/feedback';
import { RestangularModule, Restangular} from 'ngx-restangular';
import { baseURL} from '../shared/baseurl';
import { ProcessHTTPMsgService}} from './process-httpmsg.service';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  feed: Feedback;

  submitFeedback(feed): Observable<Feedback[]> {console.log (feed);
    return this.restangular.all('feedback').post(feed);
  }
}
