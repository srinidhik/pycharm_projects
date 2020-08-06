import { Component, ViewChild } from '@angular/core';
import { IonContent, AlertController, ModalController, NavParams, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as underscore from 'underscore';
import { MessageService } from '../../services/message-service';
import { ShutterService } from '../../services/shutter-service';
import { Competitor } from '../../models/competitor.model';
import { CompetitorService } from '../../services/competitor-service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UiService } from '../../../../services';
import { NetworkService } from '../../services/network-service';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./add-competitor.page.scss'],
})
export class ModalComponent {

  public competitor: any;
  public isDuplicate: any;
  public competitorData: any;
  public competitorDetails: any;
  public images: any;
  public competitorsStatus: boolean;

  constructor(
    private router: Router,
    public modal: ModalController,
    private messageService: MessageService,
    public uiService: UiService,
    private competitorService: CompetitorService,
    public navParams: NavParams,
  ) {

    this.isDuplicate = this.navParams.get('isDuplicate');
    if (this.isDuplicate) {
      this.competitorDetails = this.navParams.get('duplicate');
      this.competitorData = this.navParams.get('competitor');
      this.images = this.navParams.get('images');
      this.competitorsStatus = this.navParams.get('competitorsStatus');
    } else {
      this.competitorDetails = this.navParams.get('data');
    }

  }

  closeModal() {
    this.modal.dismiss();
  }

  isAgent() {
    return localStorage.getItem('userType') === 'A' ? true : false;
  }

  submitCompetitor() {
    this.uiService.showLoader(this.messageService.uploadingCompetitorDataMsg);
    this.competitorService.saveCompetitorInfo(this.competitorData, this.images, false).subscribe(data => {
      if (data.STATUS === 'SUCCESS') {
        this.uiService.showToast(data.DATA);
      } else if (data.STATUS === 'FAILURE') {
        this.uiService.showToast(data.DATA);
      }
      this.uiService.hideLoader();
      this.closeModal();
    },
    (err) => {
      console.log(err);
      this.uiService.hideLoader();
      this.closeModal();
      this.uiService.showToast('Data unable to upload now');
    }
    );
  }

}


@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.page.html',
  styleUrls: ['./add-competitor.page.scss'],
})
export class AddCompetitorPage {

  public photos: any = [] ;
  public photosStr: any = [];
  public photoCount = 0;
  public base64Image: string;
  public noImage = true;
  public latitude: number;
  public longitude: number;
  public gAddress: string;
  public gAddressFound = false;
  public locality = 'TG';
  public outletDimensions: number = undefined;
  public pharmacyChain = 'other';
  public otherPharmacyChain: string;
  public outletName: string;
  public doorType: string;
  public dailySales: number;
  public ageOfShop = 0;
  public pincode: string ;
  public city: string = undefined;
  public approxFrontage: number;
  public monthValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  public months = 0;

  navLinksArray = [];

  constructor(
    private router: Router,
    public camera: Camera,
    private alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions,
    private uiService: UiService,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private messageService: MessageService,
    private shutterService: ShutterService,
    private competitorService: CompetitorService,
    private networkService: NetworkService,
    public modal: ModalController,
    private platform: Platform,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(response => {
      this.turnOnGPS('');
      this.resetForm();
    });
   }

  @ViewChild(IonContent) content: IonContent;
  localityList = [
    {state: 'Telangana', code: 'TG'},
    {state: 'Tamil Nadu', code: 'TN'},
    {state: 'Andhra Pradesh', code: 'AP'},
    {state: 'Delhi', code: 'DL'},
    {state: 'Gujarat', code: 'GU'},
    {state: 'Haryana', code: 'HY'},
    {state: 'Karanataka', code: 'KA'},
    {state: 'Kerala', code: 'KL'},
    {state: 'Maharashtra', code: 'MH'},
    {state: 'Odisha', code: 'OR'},
    {state: 'Rajasthan', code: 'RJ'},
    {state: 'West Bengal', code: 'WB'},
    {state: 'Uttar Pradesh', code: 'UP'}
  ];

  localityData = {
    Telangana: 'TG',
    'Tamil Nadu': 'TN',
    'Andhra Pradesh': 'AP',
    Delhi: 'DL',
    Gujarat: 'GU',
    Haryana: 'HY',
    Karanataka: 'KA',
    Kerala: 'KL',
    Maharashtra: 'MH',
    Odisha: 'OR',
    Rajasthan: 'RJ',
    'West Bengal': 'WB',
    'Uttar Pradesh': 'UP'
  };

  competitorsList = [
    {name: 'Apollo Pharmacy', code: 'apolloPharmacy'},
    {name: 'Aditya Pharmacy', code: 'adityaPharmacy'},
    {name: 'Fortis', code: 'fortis'},
    {name: 'Frank Ross Pharmacy', code: 'frankRossPharmacy'},
    {name: 'Medzone', code: 'medzone'},
    {name: 'Trust Chemists and druggists', code: ''},
    {name: 'Thulasi Pharmacy', code: ''},
    {name: 'Pasumai Pharmacy', code: ''},
    {name: 'Muthu Pharmacy', code: ''},
    {name: 'VIVA pharmacy', code: ''},
    {name: 'STAY HAPPI Pharmacy', code: ''},
    {name: 'Others', code: 'other'}
  ];

  ionViewDidLoad() {
     console.log('ionViewDidLoad MapCompetitionPage' + this.gAddressFound);
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 30, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      cameraDirection: 0
    };
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;

      this.photos.push(this.base64Image);
      this.photosStr.push(imageData);
      this.photoCount = this.photos.length;
      this.noImage = false;
    });
  }

  resetForm() {
     this.latitude = undefined;
     this.longitude = undefined ;
     this.gAddress = undefined;
     this.gAddressFound = false;
     this.locality = 'TG';
     this.outletDimensions = undefined;
     this.pharmacyChain = 'other';
     this.otherPharmacyChain = undefined;
     this.outletName = undefined;
     this.doorType = undefined;
     this.dailySales = undefined;
     this.ageOfShop = 0;
     this.pincode = undefined;
     this.city = undefined;
     this.approxFrontage = undefined;
     this.photos = [] ;
     this.photosStr = [];
     this.photoCount = 0;
     this.base64Image = undefined;
     this.noImage = true;
  }

  async deletePhoto(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'you want to delete this photo?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.photos.splice(index, 1);
            this.photoCount = this.photos.length;
            this.photosStr.splice(index, 1);
            if (this.photoCount === 0) {
              this.noImage = true;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  turnOnGPS(flag) {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then((response) => {
      console.log('getting permission : ' + JSON.stringify(response));
      if (response.hasPermission) {
        this.locationAccuracyRequest(true);
      } else {
        this.uiService.showToast('Unable to Turn on your device GPS.');
      }
    }, (error) => {
      console.log('error while turning on GPS : ' + error);
    });
  }

  private locationAccuracyRequest(flag) {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        console.log('Request successful');
        this.getCurrentPosition(true);
      },
      error => {
        console.log('Error requesting location permissions.', error);
        if (flag && error.code !== 4) {
          this.locationAccuracyRequest(false);
        }
      }
    );
  }

  getCurrentPosition(flag) {
    const options1: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.uiService.showLoader(this.messageService.locationCapture).then(() => {
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true , timeout: 10000, maximumAge: 30000 }).then((response) => {
        this.latitude = response.coords.latitude;
        this.longitude = response.coords.longitude;
        console.log('latlongs: ' + this.latitude + ' : ' + this.longitude);
        this.shutterService.getGeoAddress(this.latitude, this.longitude).subscribe(
          (res) => {
            console.log(res);
            if (res.STATUS === 'SUCCESS') {
              this.gAddressFound = true;
              this.gAddress = res.DATA.location;
              this.locality = this.localityData[res.DATA.state];
              this.pincode = res.DATA.pinCode;
              this.city = res.DATA.city;
            } else {
              this.uiService.showToast('Failed to get Location');
            }
            this.uiService.hideLoader();
          }, (error) => {
            this.uiService.hideLoader();
          });

      }, (errorRes) => {
        this.gAddressFound = false;
        console.log('timeout' + JSON.stringify(errorRes));
        this.uiService.hideLoader();
      });
    });
  }

  validateChain(pharmacyChain, otherPharmacyChain) {
    if (pharmacyChain === 'other') {
      if (underscore.isEmpty(otherPharmacyChain)) {
        this.otherPharmacyChain = 'NA';
      } else {
        this.pharmacyChain = this.pharmacyChain + '(' + otherPharmacyChain + ')';
      }
    }
  }

  validateAddress() {
    const response: any = {};
    if ( underscore.isEmpty(this.gAddress) || underscore.isUndefined(this.gAddress)) {
      response.msg = 'Please provide Address';
      response.status = true;
      return response;
    }
    response.status = false;
    return response;
  }

  setCompetitorPojoData(competitor: Competitor) {
    competitor.setUserMobileNo(localStorage.getItem('mobile'));
    competitor.setAddress(this.gAddress);
    competitor.setAgeOfShop(this.ageOfShop);
    competitor.setCity(this.city);
    competitor.setCreatedBy(atob(localStorage.getItem('loginUserId')));
    competitor.setDailySales(this.dailySales);
    competitor.setDoorType(this.doorType);
    competitor.setLatitude(this.latitude);
    competitor.setLongitude(this.longitude);
    competitor.setLocality(this.locality.trim());
    competitor.setOutletName(this.outletName);
    competitor.setPharmacyChain(this.pharmacyChain);
    competitor.setPincode(this.pincode);
    competitor.setStoreDimensions(this.outletDimensions);
    competitor.setStoreFrontArea(this.approxFrontage);
    competitor.setUserId(atob(localStorage.getItem('loginUserId')));
  }

  submitCompetitor() {

    if (underscore.isEmpty(this.outletName) && this.pharmacyChain === 'other') {
      this.uiService.showToast('Please enter valid Outlet Name.');
      return;
    }

    if (underscore.isEmpty(this.doorType) || underscore.isUndefined(this.doorType)) {
      this.uiService.showToast('please choose shutter type.');
      return;
    }

    if (underscore.isEmpty(this.approxFrontage) || isNaN(this.approxFrontage)) {
      this.uiService.showToast('Please provide Valid Approximate Frontage.');
      return;
    }

    const response = this.validateAddress();
    if (response.status) {
      this.uiService.showToast(response.msg);
      return;
    }

    if (!/^\d{6}$/.test(this.pincode)) {
      this.uiService.showToast('please provide a valid Pin Code.');
      return;
    }

    if (underscore.isEmpty(this.city) || underscore.isUndefined(this.city)) {
      this.uiService.showToast('please provide a valid City.');
      return;
    }

    if (this.noImage) {
      this.uiService.showToast('Please capture Image.');
      return;
    }

    this.ageOfShop = this.ageOfShop * 12 + this.months;

    this.validateChain(this.pharmacyChain, this.otherPharmacyChain);

    const competitor = new Competitor();
    this.setCompetitorPojoData(competitor);

    this.uiService.showLoader(this.messageService.uploadingCompetitorDataMsg);
    const result: any = {};

    if (!this.networkService.isOnline()) {
        result.STATUS = false;
        result.MESSAGE = this.messageService.networkNotAvialMsg;
        console.log(result);
        this.uiService.hideLoader();
        }
    this.competitorService.getImageServerUrl().subscribe((resp) => {
        this.competitorService.uploadImagesToserver(resp, this.photosStr).subscribe(
          (res) => {
            this.competitorService.saveCompetitorInfo(competitor , res.response, true).subscribe((data) => {
              if (data.STATUS === 'SUCCESS') {
                result.STATUS = true;
                result.MESSAGE = data.DATA;
                console.log(result);
                this.uiService.hideLoader();
              } else if (data.STATUS === 'FAILURE') {
                result.STATUS = false;
                result.MESSAGE = data.DATA;
                console.log(result);
                this.uiService.hideLoader();
              } else if (data.STATUS === 'PENDING') {
                result.STATUS = false;
                console.log(result);
                console.log(JSON.parse(data.DATA));
                const compStatus = (data.COMPETITORS_STATUS === 'PHARMACY_CHAIN_MATCH') ? false : true;
                this.presentModal({ duplicate: JSON.parse(data.DATA), competitor,
                  images: res.response, isDuplicate: true, competitorsStatus: compStatus});
                this.uiService.hideLoader();
              }
              this.resetForm();
              this.router.navigate(['/menu/add-competitor/tabs/competitor-dashboard/null']);
          }, (error) => {
            result.STATUS = false;
            result.MESSAGE = 'Server Down';
            console.log(result);
            this.uiService.hideLoader();
          });
          }, (error) => {
            result.STATUS = false;
            result.MESSAGE = 'Image Upload Failed';
            console.log(result);
            this.uiService.hideLoader();
          });
        }, (error) => {
          result.STATUS = false;
          result.MESSAGE = 'Image Server Error';
          console.log(result);
          this.uiService.hideLoader();
        });


  }

  async presentModal(data: any) {
    const modal = await this.modal.create({
      component: ModalComponent,
      componentProps: data,
      backdropDismiss: false
    });
    await modal.present();
  }

}
