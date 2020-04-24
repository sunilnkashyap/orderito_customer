import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(
    public splashScreen: SplashScreen,
    public navCtrl: NavController,
    public storage: Storage
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {

    this.splashScreen.hide();

    setTimeout(() => {
      console.log('here');
      // this.storage.set("isSplash", true);
      this.navCtrl.navigateRoot('h/tabs/mainhome');
      // this.modalCtrl.dismiss();
    }, 4000);

  }

}
