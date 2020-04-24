import { Component, OnInit } from '@angular/core';
import { MenuController, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FunctionsService } from '../functions.service';
import { LocationPage } from './../location/location.page';
import { ViewChild } from '@angular/core';
import { DataService, HomeTab, Product } from '../data.service';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private fun: FunctionsService,
    public loadingController: LoadingController,
    private splashScreen: SplashScreen,
    public modalController: ModalController
  ) { }
  ionViewDidEnter() {
    // this.menuCtrl.enable(true, 'start');
    // this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }
  ngOnInit() {
  }

}
