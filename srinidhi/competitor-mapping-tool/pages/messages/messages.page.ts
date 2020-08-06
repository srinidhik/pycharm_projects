import { Component } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage {

  public messageData = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
    this.getNavParam();
  }

  getNavParam() {
    const messageData = this.navParams.get('messageData');
    // if(!underscore.isEmpty(messageData)){
    //     this.messageData = messageData;
    // }
  }

}
