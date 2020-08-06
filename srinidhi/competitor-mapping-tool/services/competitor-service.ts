import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competitor } from '../models/competitor.model';
import { Urls } from 'src/app/const/urls';
import { UiService } from '../../../services';
import { MessageService } from './message-service';
import { NetworkService } from './network-service';
import { timeout } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class CompetitorService {
  API_ENDPOINT: any;
  constructor(
    private http: HttpClient,
    private uiService: UiService,
    private messageService: MessageService,
    private networkService: NetworkService,
    public modal: ModalController,
  ) {
    this.API_ENDPOINT = Urls.CMT_HOST;
  }

  public saveCompetitorInfo(competitorData: Competitor, imagesList: any[], checkDuplicateFlag: boolean): Observable<any> {
    const formData = { competitorInfo: JSON.stringify(competitorData), images: imagesList, checkDuplicate: checkDuplicateFlag };
    console.log(formData);
    return this.http.post(this.API_ENDPOINT + 'saveCompetitorInfo.io', formData, { headers: { 'Content-Type': 'application/json' } });
  }

  public updateCompetitorStatus(compId: string, newStatus: string, id: string, checkDuplicateFlag: boolean, rejectComment: string): Observable<any> {
    const formData = { competitorId: compId, status: newStatus, modifiedBy: id, checkDuplicate: checkDuplicateFlag, comment: rejectComment };
    return this.http.post(this.API_ENDPOINT + 'updateCompetitorStatus.io', formData, { headers: { 'Content-Type': 'application/json' } });
  }

  public getImageServerUrl(): Observable<any> {
    return this.http.get(this.API_ENDPOINT + 'getImageServer.io?imageType=CI').pipe(timeout(6000));
  }

  public uploadImagesToserver(serverInfo, imagesList): Observable<any> {
    const MobileUploadRequest = {
      imageFiles: imagesList,
      fileName: 'competitor_img',
      imageType: 'CI',
      vertical: 'MOB',
    };

    return this.http.post(serverInfo.imageServerUrl + '/upload-content?token=' +
      serverInfo.accessToken + '&clientId=' + serverInfo.clientId + '&vertical=MOB',
      MobileUploadRequest, { headers: { 'Content-Type': 'application/json' } }).pipe(timeout(3 * 60 * 1000));

  }

  public getCompetitorInfo(id: any, isAgent: boolean, pinCode, limitFrom: number, status: string): Observable<any> {
    let competitorSearchCriteria;
    if (isAgent) {
      competitorSearchCriteria = { userId: null };
      if (pinCode) {
        competitorSearchCriteria = { pincode: pinCode };
      }
    } else {
      competitorSearchCriteria = { createdBy: id };
    }
    competitorSearchCriteria.limitFrom = limitFrom;
    competitorSearchCriteria.limitTo = 10;
    competitorSearchCriteria.status = status;
    const formData = competitorSearchCriteria;
    return this.http.post(this.API_ENDPOINT + 'getCompetitorRecords.io', formData, { headers: { 'Content-Type': 'application/json' } });
  }

  public getMedplusStore(cityName: string, pinCode: string, limitFromNum: number): Observable<any> {
    const storeSearchCriteria = {
      city: cityName,
      pincode: pinCode,
      limitFrom: limitFromNum
    };
    console.log(storeSearchCriteria);
    return this.http.post(this.API_ENDPOINT + 'getMedplusRecords.io',
      storeSearchCriteria, { headers: { 'Content-Type': 'application/json' } });
  }

  public getNearbyCompetitors(storeid: string): Observable<any> {
    const searchCriteria = { storeId: storeid };
    return this.http.post(this.API_ENDPOINT + 'getNearbyCompetitors.io',
      searchCriteria, { headers: { 'Content-Type': 'application/json' } });
  }

  public getCitiesData(): Observable<any> {
    return this.http.post(this.API_ENDPOINT + 'getCitiesData.io', {}, { headers: { 'Content-Type': 'application/json' } });
  }

}

