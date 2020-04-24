import { LocationPageModule } from './location/location.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InfomodalPage } from './infomodal/infomodal.page';
import { HttpClientModule } from '@angular/common/http';
import {IonicStorageModule} from "@ionic/storage";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AutocompletePageModule } from './autocomplete/autocomplete.module';
import { GoogleMaps } from '@ionic-native/google-maps';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ExpandableComponent } from "./components/expandable/expandable.component";
import { Facebook } from '@ionic-native/facebook/ngx';
import { Push } from '@ionic-native/push/ngx';

@NgModule({
  declarations: [AppComponent, InfomodalPage],
  entryComponents: [InfomodalPage],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AutocompletePageModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TooltipsModule.forRoot(),
    BrowserAnimationsModule,
    LocationPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    Camera,
    FileTransfer,
    ExpandableComponent,
    File,
    Push,
    Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GoogleMaps
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
