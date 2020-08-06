import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shutter } from '../models/shutter.model';
import { Urls } from 'src/app/const/urls';
import { timeout } from 'rxjs/operators';
import { MessageService } from './message-service';
import { NetworkService } from './network-service';

@Injectable({
  providedIn: 'root'
})
export class ShutterService {
  API_ENDPOINT: any;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private networkService: NetworkService,
  ) {
    this.API_ENDPOINT = Urls.CMT_HOST;
  }

  public saveShutter(shutterData: Shutter, imagesList: any[], isAgent, deleteId): Promise<any> {
    const result = {
      STATUS: false,
      MESSAGE: ''
    };
    return new Promise((resolve, reject) => {
      if (!this.networkService.isOnline()) {
        result.STATUS = false;
        result.MESSAGE = this.messageService.networkNotAvialMsg;
        resolve(result);
      }
      this.getImageServerUrl().subscribe((res) => {
        this.uploadImagesToserver(res, imagesList).subscribe(
          (response) => {
            this.saveShutterInfo(shutterData, response.response, isAgent, deleteId).subscribe((data) => {
              if (data.STATUS === 'SUCCESS') {
                result.STATUS = true;
                result.MESSAGE = data.DATA;
                resolve(result);
              } else if (data.STATUS === 'FAILURE') {
                result.STATUS = false;
                result.MESSAGE = data.DATA;
                resolve(result);
              }
            }, (error) => {
              result.STATUS = false;
              result.MESSAGE = 'Server Down';
              resolve(result);
            });
          }, (error) => {
            result.STATUS = false;
            result.MESSAGE = 'Image Upload Failed';
            resolve(result);
          });
      }, (error) => {
        result.STATUS = false;
        result.MESSAGE = 'Image Server Error';
        resolve(result);
      });

    });
  }

  public saveShutterInfo(shutterData: Shutter, imagesList: any[], isAgent, deleteId: any[]): Observable<any> {
    if (!isAgent) {
      const formData = { shutterInfo: JSON.stringify(shutterData), images: imagesList };
      return this.http.post(this.API_ENDPOINT + 'saveShutterInfo.io', formData, { headers: { 'Content-Type': 'application/json' } });
    } else {
      const formData = { shutterInfo: JSON.stringify(shutterData), images: imagesList, imageIds: deleteId };
      return this.http.post(this.API_ENDPOINT + 'updateShutterInfo.io', formData, { headers: { 'Content-Type': 'application/json' } });
    }
  }

  private getImageServerUrl(): Observable<any> {
    return this.http.get(this.API_ENDPOINT + 'getImageServer.io?imageType=SI',
    ).pipe(timeout(1 * 60 * 1000));
  }

  private uploadImagesToserver(serverInfo, imagesList): Observable<any> {
    const MobileUploadRequest = {
      imageFiles: imagesList,
      fileName: 'shutter_img',
      imageType: 'SI',
      vertical: 'MOB',
    };
    return this.http.post(serverInfo.imageServerUrl + '/upload-content?token=' +
      serverInfo.accessToken + '&clientId=' + serverInfo.clientId + '&vertical=MOB',
      MobileUploadRequest, { headers: { 'Content-Type': 'application/json' } }).pipe(timeout(3 * 60 * 1000));
  }

  public getShutterInfo(id: any, userType: string, newStatus: string, limitFrom: number): Observable<any> {
    let shutterSearchCriteria = {};
    if (newStatus === 'I') {      
      if (userType !== 'A') {
        shutterSearchCriteria['userId'] = id;
      }
    } else {
      shutterSearchCriteria['status'] = newStatus;
      shutterSearchCriteria['fieldVerifiedBy'] = id;
    }
    shutterSearchCriteria['imageInfoRequired'] = true;
    shutterSearchCriteria['limitFrom'] = limitFrom;
    shutterSearchCriteria['limitTo'] = 10;
    const formData = shutterSearchCriteria;
    return this.http.post(this.API_ENDPOINT + 'getShutterRecords.io', formData, { headers: { 'Content-Type': 'application/json' } });
  }

  public getShutterComments(id: any): Observable<any> {
    const formData = { shutterId: id };
    return this.http.post(this.API_ENDPOINT + 'getShutterComments.io', formData, { headers: { 'Content-Type': 'application/json' } });
  }

  public getGeoAddress(lat: any, long: any): Observable<any> {
    const formData = { latitude: lat, longitude: long };
    return this.http.post(this.API_ENDPOINT + 'getGeoAddress.io', formData, { headers: { 'Content-Type': 'application/json' } });
  }

  public getCities(locality: string): Observable<any> {
    return this.http.get(this.API_ENDPOINT + 'getCities.io?state=' + locality);
  }
}
