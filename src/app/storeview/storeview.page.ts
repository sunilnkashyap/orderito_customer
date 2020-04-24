import { LocationPage } from './../location/location.page';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MenuController, AlertController, IonSlides, Events } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import {ApiService} from "../services/api.service";
import { LoaderService } from "../services/loader.service";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-storeview',
  templateUrl: './storeview.page.html',
  styleUrls: ['./storeview.page.scss'],
})
export class StoreviewPage implements OnInit {
  cat_name : string;
  storeList:any = [];
  distanceUnit: string;
  restaurantList:any = [];
  filterData:any = [];
	param:any;
  rate : number = 0;
	lat:number;
	long: number;
	searchRestaurant:any;
  showLoader:any;
  public search_keyword = "";
  public showstore: boolean = true;
  constructor(
    private api: ApiService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private router: Router,
    private fun: FunctionsService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private alertController: AlertController,
    public storage: Storage,
    private event:Events,
    private splashScreen: SplashScreen) {
      this.event.subscribe('FETCHSTORE', (data)=>{
          console.log("FETCHSTORE", data);
          setTimeout(()=>{             
                    this.fetchStores();

               }, 1500); 
      });
      this.event.subscribe('LOCATIONSEARCH', (data)=>{
        console.log(data);
        // setTimeout(()=>{             
          this.locationsearch(data);
        // }, 500); 
      });
      // setTimeout(()=>{
      //   this.event.unsubscribe('FETCHSTORE');
      // }, 2000);
      
  }
  async showlocation() {
    const modal = await this.modalController.create({
      component: LocationPage
    });
    return await modal.present();
  }

  ngOnInit() {
    console.log("on int........................");
    this.rate = 2.5;
    this.cat_name = this.activatedRoute.snapshot.paramMap.get('cat_name');
    this.storage.set('CURRENT_CATEGORY', this.cat_name);
    this.storage.get('userLat').then((userLat) => { 
      console.log(userLat);
      this.lat = userLat;
    });
    this.storage.get('userLong').then((userLong) => { 
      console.log(userLong);
      this.long = userLong;
    });
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(true, 'end');
    this.splashScreen.hide();
    this.searchRestaurant = "";
    console.log("Entering StoreviewPage ..................");
    setTimeout(()=>{
      this.fetchStores();
    },1500);
  }


  locationsearch(data:any){
    this.lat = data.Latitude;
    this.long = data.longitude;
  }

  fetchStores(){
    // this.storage.get('userLat').then((userLat) => { this.lat = userLat });
    // this.storage.get('userLong').then((userLong) => { this.long = userLong });
    this.storage.get('filterData').then((filterData) => { 
      this.filterData = filterData; 
      console.log("this.filterData", this.filterData);
      if(this.filterData)
        {
          this.storeList = this.filterData.store;
          this.storage.set('FOUNDSTORE', this.storeList);
          // if(this.filterData.message == "Store Found"){
          //   this.showstore = true;
          // }
          // else{
          //   this.showstore = false;
          //   // this.createAlert('No store found');
          // }
          if(this.filterData.store.length > 0){
            this.showstore = true;
          }
          else{
            this.showstore = false;
            // this.createAlert('No store found');
          }
          // this.event.unsubscribe('FETCHSTORE');
          setTimeout(()=>{             
            this.storage.remove('filterData');
          }, 1000);
        }
        else{
          // alert('api');
          let formData = {
            "cate_name": this.cat_name,
            "lat" : this.lat,
            "long" : this.long,
            "search_keyword" : this.search_keyword
          }
          // console.log(formData);
          this.loaderService.show("Please wait....");
          this.api.post("store_listing.php", formData).subscribe((res: any)=>{
            this.loaderService.hideAll();
            let myData = res.response;
            this.search_keyword = "";
            this.storeList = myData.store;
            this.storage.set('FOUNDSTORE', this.storeList);
            if(myData.store.length > 0){
              this.showstore = true;
            }
            else{
              this.showstore = false;
            }
            // console.log(this.storeList);
          },(err) => {
                this.loaderService.hideAll();
                // this.loaderService.showToast(this.translate.instant(API_RESPONSE.PROBLEM_IN_API));
          })
        }
        // console.log(this.storeList);
        
        

    });  
    // 
  }

  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }
 side_open() {
    this.menuCtrl.toggle('end');
  }
  async presentLoading(id:any, isOpen:any) {
    console.log(id);
    console.log(isOpen);
    if(isOpen == 0){
      this.loaderService.showToast("Store is Closed");
    }
    else{
      // this.fun.navigate('/tabs/search/'+this.cat_name, false);
      this.fun.navigate('/tabs/home/'+id, false);
    }
  }

  searchRestaurantByString(){
    this.search_keyword = this.searchRestaurant;
    this.fetchStores();
  }
  async createAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: '',
      message: msg,
      buttons: [{
          text: 'Ok',
        }]
    });

    await alert.present();
  }
}
