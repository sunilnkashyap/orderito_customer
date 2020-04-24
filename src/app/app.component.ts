
import { Component } from '@angular/core';
import { MenuController, NavController, Platform, Events, ModalController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './data.service';
import { FunctionsService } from './functions.service';
import {ApiService} from './services/api.service';
import {Storage} from "@ionic/storage";
// import { Environment } from '@ionic-native/google-maps/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import {LoaderService} from "./services/loader.service";
import { APP_NAME, StringConstant } from "./app.stringconstant";

// import { SplashPage } from './splash/splash.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isCouponChecked : boolean = false;
  cusineList : any = [];
  lat:number;
	long: number;
  side_open = true;
  side_open1 = true;
  types : any;
  selectedArray:any = [];
  cuisines:any;
  filterCountCoupon: number = 0;
  cat_name : string;
  restaurantList:any = [];
  userImage = "";
  userName="";
  userEmail="";
  public cart_count = 0;
  userID: number;
  currentAddress:any;

  public appPages = [
    { title: 'Home', url: '/mainhome', icon: 'home' },
    { title: 'Store', url: '/storeview', icon: 'home' },
    { title: 'Order History', url: '/orders', icon: 'list' },
    { title: 'My Profile', url: '/profile', icon: 'Person' },
    //{ title: 'Browse', url: '/home', icon: 'logo-buffer' },
    //{ title: 'Search', url: '/search', modal: true, icon: 'search' },
    { title: 'Sign In', url: '/login', icon: 'log-in' },
    { title: 'Log Out', url: '/', icon: 'Power' },
    { title: 'Sign Up', url: '/signup', icon: 'person-add' },
    //{ title: 'Notifications', url: '/notification', icon: 'notifications' },
    { title: 'Shopping Cart', url: '/cart', icon: 'cart' },

    //{ title: 'Wish Cash', url: '/wishcash', icon: 'wallet' },
    //{ title: 'Rewards', url: '/rewards', icon: 'trophy' },
    //{ title: 'Apply Promo', url: '/applypromo', icon: 'megaphone' }
  ];
  // public appPages1 = [
  //   { title: 'Customer Support', url: '/support', icon: 'people' },
  //   { title: 'FAQs', url: '/faqs', icon: 'help-circle' },
  //   { title: 'Settings', url: '/settings', icon: 'cog' }
  // ];

  

  menu(b) {
    if (b) {
      this.side_open = false;
      this.side_open1 = true;
    }
    else {
      this.side_open = false;
      this.side_open1 = false;
    }
  }

  back() {
    this.side_open = true;
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public dataService: DataService,
    public fun: FunctionsService,
    private api: ApiService,
    public storage: Storage,
    private menuCtrl: MenuController,
    private event:Events,
    private loaderService: LoaderService,
    private navController: NavController,
    private push: Push,
    public modalCtrl: ModalController
  ) {

    this.showAllTypes();
    
    this.initializeApp();
    this.event.subscribe('APP_NAME', (data)=>{
          if(data.type == "order_status"){
              setTimeout(()=>{ 
                    this.initializeApp();
               }, 1000);
              
              this.navController.navigateRoot(['/tabs/mainhome']);
          }
      })
  }

  async initializeApp() {
    this.splashScreen.show();
     this.platform.ready().then(async () => {

      // const splash = await this.modalCtrl.create({
      //   component: SplashPage
      // });

      // // const splash = this.modalCtrl.create(SplashPage);
      // splash.present();


      // Environment.setEnv({
      //   // api key for server
      //   // 'API_KEY_FOR_BROWSER_RELEASE': 'YOUR_API_KEY_HERE',
 
      //   // api key for local development
      //   'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBTr8TEA-OpmuOHjXzeAUPQzOCCH7uGJzc'
      // });
      // this.statusBar.styleDefault();
      // let status bar overlay webview
      // this.statusBar.overlaysWebView(true);
      this.statusBar.overlaysWebView(false);

      // set status bar to white
      this.initPushNotification();
      this.statusBar.backgroundColorByHexString('#000000');
      console.log('everything is loaded')
      // this.splashScreen.hide();
    });
  }

  showAllTypes(){
    let formData = {
    }
    this.api.post("all_cuisine_list.php", formData).subscribe((res: any)=>{
      console.log(res);
      this.cusineList = res.response.userData.cuisineList;
      console.log(this.cusineList);
      
    },(err) => {
      console.log("error");
    })
  }

  allboxclear(){
    // alert();
    this.isCouponChecked = false;
      this.cusineList.forEach(obj => {
        obj.isChecked = false;
      });
    
  }
  filterCoupon(event){
    // console.log(event);
    if(event.target.checked == true){
      // console.log("true");
      this.filterCountCoupon = 1;
    }
    else{
      // console.log("false");
      this.filterCountCoupon = 0;
    }
  }

  updateCuisineCheck(data) {
    // console.log(data);
    if (data.isChecked == true) {
      this.selectedArray.push(data);
      // console.log(this.selectedArray);
    } else {
     let newArray = this.selectedArray.filter(function(el) {
       console.log(el);
       console.log(data);
       return el.isChecked !== data.isChecked;
    });
     this.selectedArray = newArray;
   }
    console.log(this.selectedArray);
    this.cuisines = this.selectedArray.map((el)=>{return el.cuisine_id;}).join(",");
    console.log(this.cuisines);
  }

  applyFilter(){
    // this.event.unsubscribe('FETCHSTORE');
    this.storage.get('userLat').then((userLat) => { this.lat = userLat });
    this.storage.get('userLong').then((userLong) => { this.long = userLong });
    this.storage.get('CURRENT_CATEGORY').then((catName) => { this.cat_name = catName });
      setTimeout(() => {
      //   this.loaderService.show("Please wait....");
        let param_data = {lat:this.lat, long: this.long, cat_name: this.cat_name, cuisines: this.cuisines, coupon:this.filterCountCoupon};
        this.api.post("home_screen_filter.php", param_data).subscribe((resp:any)=>{
          this.restaurantList = resp.response;
          this.storage.set("filterData", this.restaurantList);
          setTimeout(() => {
            this.menuCtrl.close();
            this.event.publish('FETCHSTORE', {
              type: 'storefetch'
            });
          },100);
        },(err) => {
          // this.loaderService.showToast(this.translate.instant(API_RESPONSE.PROBLEM_IN_API));
        });
      },500);
  }


  initPushNotification() {
        console.log("Push Notification .....");
        this.push.hasPermission()
            .then((res: any) => {
                if (res.isEnabled) {
                    console.log('We have permission to send push notifications');
                } else {
                    console.log('We do not have permission to send push notifications');
                    this.loaderService.showToast("We do not have permission to send push notifications");
                }
        });

        const options: PushOptions = {
            android: {
                senderID: StringConstant.PUSH_SENDER_ID,
                icon: "notificationicon",
                iconColor: "#bf0606"
            },
            ios: {
                alert: 'true',
                badge: false,
                sound: 'true'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };
        const pushObject: PushObject = this.push.init(options);

        pushObject.on('registration').subscribe((data: any) => {
            console.log('device token -> ' + data.registrationId);
            let deviceType = "";

            if (this.platform.is("android")) {
                deviceType = "Android";
            }

            if (this.platform.is("ios")) {
                deviceType = "iOS";
            }

            this.storage.get('USER_ID').then(id=>{
                if(id) {
                    this.userID = id;
                    if (deviceType != "") {
                        this.api.post('register_devices.php', {
                            device_id: data.registrationId,
                            device_type: deviceType,
                            customer_id: this.userID
                        }).subscribe((data:any) => {
                            console.log(data);
                        }, (err) => {
                            console.error('Error with Push plugin' + err);
                        });
                    }
                }
            });

        });

        pushObject.on('notification').subscribe((data: any) => {
            //console.log('message -> ' + data.message, JSON.stringify(data));
            //if user using app and push notification comes
            if (data.additionalData.foreground) {
                this.event.publish(APP_NAME, {type: "reload_order"});
            } else {
                this.event.publish(APP_NAME, {type:"play_sound"});
                //if user NOT using app and push notification comes
                console.log('Push notification clicked');

            }
        });

        pushObject.on('error').subscribe((error) => {
            console.error('Error with Push plugin' + error)
        });
    }
}
