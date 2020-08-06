import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';


@Injectable({
    providedIn: 'root'
  })
export class NetworkService {
    flag: boolean;
    constructor(
        private network: Network,
        private platform: Platform) {
        this.platform.ready().then(() => {
        if (this.network.type !== 'none') {
            this.flag = true;
        }

        this.network.onDisconnect().subscribe(() => {
            this.flag = false;
        });

        this.network.onConnect().subscribe(() => {
            this.flag = true;
        });
        });
    }

    isOnline() {
        return this.flag;
    }
}
