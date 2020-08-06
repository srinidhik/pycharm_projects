import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    public readonly warn = 'Warning';
    public readonly info = 'Information';
    public readonly error = 'Error';

    public readonly loggingExpiredMsg = 'Login expired.\nPlease login again';
    public readonly loggingInMsg = 'Logging in...';
    public readonly loggingOutMsg = 'Logging out...';
    public readonly gettingInfoMsg = 'Getting info...';
    public readonly noScanDataMsg = 'No data found in scan';
    public readonly errorScanMsg = 'Error in scanning';
    public readonly wrongCrendentialMsg = 'Wrong credentials';
    public readonly noAppropriateRolesMsg = 'You don\'t have appropriate rights';
    public readonly invalidSessionMsg = 'Invalid session. Please try again.';
    public readonly success = 'SUCCESS';
    public readonly deletePhotoMsg = 'you want to delete this photo?';
    public readonly updatingPhotoMsg = 'Loading Photo..';
    public readonly uploadingShutterDataMsg = 'Please wait Shutter data is uploading..';
    public readonly uploadingCompetitorDataMsg = 'Please wait Competitor data is uploading..';
    public readonly uploadingShutterImgEmptyMsg = 'Please capture Shutter before submit';
    public readonly networkNotAvialMsg = 'Network Not Available';
    public readonly invalidStatus = 'Please refresh page and try again.';
    public readonly locationCapture = 'Trying to locate you..';


    constructor() { }

    public getHttpErrorMessage(error: any): string {
        switch (error.status) {
            case 0:
                return 'Server down';
            case 400:
                return this.getConditionalMsg(error, 'Request error');
            case 401:
                return 'Authentication error';
            case 403:
                return 'Authorization error';
            case 404:
                return 'No data found';
            case 500:
                return 'Internal server error';
            default:
                return this.getConditionalMsg(error, 'Server error');
        }
    }

    private getConditionalMsg(error: any, defaultMessage: string) {
        if (error.error) {
            return error.error.message || error.error.error_description || defaultMessage;
        } else {
            return defaultMessage;
        }
    }
}
