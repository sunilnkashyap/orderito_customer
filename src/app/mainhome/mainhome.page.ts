import { Component, OnInit, NgZone, ElementRef} from '@angular/core';
import {ApiService} from "../services/api.service";
import { Events, MenuController, IonSlides, IonContent, DomController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FunctionsService } from '../functions.service';
import { LocationPage } from './../location/location.page';
import { ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DataService, HomeTab, Product } from '../data.service';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { API_RESPONSE, APP_NAME, StringConstant } from "../app.stringconstant";
import { LoaderService } from "../services/loader.service";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import * as Bounce from 'bounce.js';
declare var google;
@Component({
  selector: 'app-mainhome',
  templateUrl: './mainhome.page.html',
  styleUrls: ['./mainhome.page.scss'],
})

export class MainhomePage implements OnInit {
  // static:boolean;
  // read?: any;
  // iuhi
  // read:any;
  // @ViewChild('bouncebtn', { read: ElementRef })bouncebtn: ElementRef;
  // @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonContent)  scrollArea: IonContent;
  // @ViewChildren('bouncebtn') components:QueryList<CustomComponent>;
  // @ViewChildren(col) cols;
  activescroll:boolean = false;

  param:any;
  categoryList:any = [];
  geoAddress: string;
  filterData:any = [];
  lat:number;
  lng : number;
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoencoderOptions: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
  constructor(
    public zone: NgZone,
    private api: ApiService,
    private loaderService: LoaderService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public storage: Storage,
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private fun: FunctionsService,
    public loadingController: LoadingController,
    private splashScreen: SplashScreen,
    private event:Events,
    public modalController: ModalController,
    private platform: Platform
  ) 
  { 
    this.initializeApp();
    this.event.subscribe('LOCATIONSEARCH', (data)=>{
      console.log(data);

      // setTimeout(()=>{             
        this.locationsearch(data);
      // }, 500); 
    });
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }

  ScrollToTop(){
    this.scrollArea.scrollToTop(1500);
  }
  logScrollStart(){
    console.log("logScrollStart : When Scroll Starts");
  }

  logScrolling(event: any){
    console.log("logScrolling : When Scrolling");
    let dimensions = event.detail.scrollTop;
       //console.log(dimensions);
       if (dimensions > 160) {
           //console.log('release');
           this.activescroll = true;
       } else {
           this.activescroll = false;
       }
       // if (dimensions=this.segmentChanged) {
       //     console.log('matching id');
       // }

  }

  logScrollEnd(){
    console.log("logScrollEnd : When Scroll Ends");
  }

  // setInterval(() => { 
  //  this.bounce(); // Now the "this" still references the component
  // }, 1000);
  /*bounce() {
  var bounce = new Bounce();
  bounce
    .translate({
      from: { x: -300, y: 0 },
      to: { x: 0, y: 0 },
      duration: 600,
      stiffness: 4
    })
    .scale({
      from: { x: 1, y: 1 },
      to: { x: 0.1, y: 2.3 },
      easing: "sway",
      duration: 800,
      delay: 65,
      stiffness: 2
    })
    .scale({
      from: { x: 1, y: 1 },
      to: { x: 5, y: 1 },
      easing: "sway",
      duration: 300,
      delay: 30,
    })
    .scale({
      from: { x: 0, y: 0 },
      to: { x: 1, y: 1 },
      duration: 4000,
      delay: 100
    })
    // .applyTo(this.cols.nativeElement);
    // .applyTo(this.bouncebtn.nativeElement);
    .applyTo(document.querySelectorAll(".round-shaped"));
}*/

  initializeApp() {
    this.platform.ready().then(() => {
      //     this.getUserLocation();
      // this.getGeolocation();
    });
  }


  getUserLocation() {

     this.storage.get('searchLocation').then((searchLocation) => { 
      if(searchLocation == null)
      {

            this.geolocation.getCurrentPosition().then((resp) => {
              // alert(resp.coords.latitude);
              this.lat = resp.coords.latitude;
              // alert(resp.coords.longitude);
              this.lng = resp.coords.longitude;
              this.storage.set("userLat", this.lat);
              this.storage.set("userLong", this.lng);

              //this.getGeoLocation(resp.coords.latitude, resp.coords.longitude, 'reverseGeocode');
              // if (this.platform.is('cordova')) {
                console.log("address fetch in cordova");
                this.nativeGeocoder.reverseGeocode(this.lat, this.lng, this.geoencoderOptions)
                  .then((result: any) => {
                    console.log(result)
                    // this.geoAddress = result[0]
                    this.geoAddress = this.generateAddress(result[0]);
                    console.log(this.geoAddress);
                    this.storage.set("searchLocation", this.geoAddress);
                  })
                  .catch((error: any) => console.log(error));
              // } else {
              //   console.log("address fetch without cordova");
              //   this.getGeoLocation(this.lat, this.lng, 'reverseGeocode')
              // }
            }).catch((error) => {
              console.log("getCurrentPosition error",error);
            });
       }
       else
       {
            console.log(searchLocation);
            this.geoAddress = searchLocation; 
      }
    });




    
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   alert(data.coords.latitude);
    //   alert(data.coords.longitude);
  
    // });
  }
  // async getGeoLocation(lat, lng, type?) {
  //   if (navigator.geolocation) {
  //     let geocoder = await new google.maps.Geocoder();
  //     let latlng = await new google.maps.LatLng(lat, lng);
  //     let request = { latLng: latlng };

  //     await geocoder.geocode(request, (results, status) => {
  //       if (status == google.maps.GeocoderStatus.OK) {
  //         let result = results[0];
  //         console.log(result);
  //         this.zone.run(() => {
  //           if (result != null) {
  //             // this.userCity = result.formatted_address;
  //             if (type === 'reverseGeocode') {
  //               this.geoAddress = result.formatted_address;
  //               console.log(this.geoAddress);
  //             }
  //           }
  //         })
  //       }
  //     });
  //   }
  // }
  async showlocation() {
    const modal = await this.modalController.create({
      component: LocationPage
    });
    return await modal.present();
  }
  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  side_open() {
    this.menuCtrl.toggle('end');
  }
  ngOnInit() {
    this.storage.get('userLat').then((userLat) => { this.lat = userLat });
    this.storage.get('userLong').then((userLong) => { this.lng = userLong });
    // this.geoAddress = "searchLocation"; 
    this.storage.get('filterData').then((filterData) => { this.filterData = filterData; console.log(filterData) });

    this.storage.get('searchLocation').then((searchLocation) => { 
      console.log("searchLocation", searchLocation);
          if(searchLocation == null)
          {

                
                setTimeout(() => {
                    // this.param = {lat:this.lat, long:this.long};
                    // console.log("Location Data", this.param);
                    this.getGeolocation();
                    console.log("enter ");
                    
                }, 1000); 
                console.log("enter ");
           }
           else
           {
                console.log(searchLocation);
                this.geoAddress = searchLocation; 
          }
      });
    // this.getGeolocation(); 
    // this.fetchCategories();
    setTimeout(() => {
        // this.param = {lat:this.lat, long:this.long};
        // console.log("Location Data", this.param);
        this.fetchCategories();
        
    }, 1000);

    // setInterval(() => {this.bounce()},4000);
  }

  fetchCategories(){
    this.loaderService.show("Please wait....");
    this.param = {lat:this.lat, long:this.lng};
    this.api.post("home_screen_category.php", this.param).subscribe((resp:any)=>{
          this.loaderService.hideAll();
          // console.log(resp);
            // if (resp.response.message == API_RESPONSE.SUCCESS) {
                // if(this.filterData)
                // {
                //  //alert('hi');
                //   this.categoryList = this.filterData;
                //   this.storage.remove('filterData');
                //   //this.storage.clear();
                //   //this.getGeolocation();
                // }
                // else
                // {
                  
                  this.categoryList = resp.response;
                  //this.transform(this.restaurantList.restaurant.offerCode);
                // }
                // console.log("Returned_Data", resp.response);
                
            // } else {
                // this.loaderService.showToast(resp.response.message);
                // this.loaderService.hide();
            // }
        },(err) => {
            this.loaderService.hideAll();
            // this.loaderService.showToast(this.translate.instant(API_RESPONSE.PROBLEM_IN_API));
        });
  }

  locationsearch(data:any){
    // this.storage.get('userLat').then((userLat) => { 
    //   console.log(userLat);
    //   // this.lat = userLat 
    // });
    console.log(data);
    this.geoAddress = data.searchLocation; 
    this.lat = data.Latitude;
    this.lng = data.longitude;
    this.storage.set("userLat", data.Latitude);
    this.storage.set("userLong", data.longitude);
    // this.storage.get('searchLocation').then((searchLocation) => { 
    //   // console.log(searchLocation);
    //   this.geoAddress = searchLocation; 
       
    // });
    // this.storage.get('userLat').then((userLat) => { 
    //   console.log(userLat);
    //   this.lat = userLat;
    // });
    // this.storage.get('userLong').then((userLong) => { 
    //   console.log(userLong);
    //   this.lng = userLong;
    // });
    // console.log(this.lat);
    // console.log(this.lng);
    // let options: NativeGeocoderOptions = {
    //     useLocale: true,
    //     maxResults: 5
    //   };
    //   this.nativeGeocoder.reverseGeocode(this.lat, this.lng, options)
    //       .then((result: NativeGeocoderResult[]) => {
    //         //console.log(JSON.stringify(result[0]))
    //         this.geoAddress = this.generateAddress(result[0]);
    //       })
    //       .catch((error: any) => console.log(error));
  }

  getGeolocation(){

    console.log("getGeolocation");
      // let options: NativeGeocoderOptions = {
      //   useLocale: true,
      //   maxResults: 5
      // };
      // this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
      //     .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
      //     .catch((error: any) => console.log(error));
      setTimeout(() => {                  
      this.geolocation.getCurrentPosition( {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 0
          }).then((resp) => {
        console.log("getCurrentPosition", resp);
        this.geoLatitude = resp.coords.latitude;
        this.geoLongitude = resp.coords.longitude; 
        // this.geoAccuracy = resp.coords.accuracy; 
        // alert(this.geoLatitude);
        // alert(this.geoLongitude);
        this.storage.set("userLat", this.geoLatitude);
        this.storage.set("userLong", this.geoLongitude);
        // this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
        //   .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
        //   .catch((error: any) => console.log(error));
        this.getGeoencoder(this.geoLatitude, this.geoLongitude);
       }).catch((error) => {
          console.log("error", error);
          this.loaderService.showToast("Not found geo location");
          this.geoAddress = "Home";
       });
     },1500);
  }
  getGeoencoder(latitude,longitude){
    console.log("getGeoencoder");
  //     this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
  // .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
  // .catch((error: any) => console.log(error));
      this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
        console.log(this.geoAddress);
        this.storage.set("searchLocation", this.geoAddress);
      })
      .catch((error: any) => {
        // alert('Error getting location getGeoencoder'+ JSON.stringify(error));
      });
    }
  generateAddress(addressObj){
        let obj = [];
        let address = "";
        for (let key in addressObj) {
          obj.push(addressObj[key]);
        }
        obj.reverse();
        for (let val in obj) {
          if(obj[val].length)
          address += obj[val]+', ';
        }
      return address.slice(0, -2);
  }

}
