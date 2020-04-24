
import { Component, ViewChild, OnInit } from '@angular/core';
import {Events, MenuController, IonSlides, NavController} from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { ActivatedRoute } from '@angular/router';
import {ApiService} from "../services/api.service";
import { API_RESPONSE, APP_NAME, StringConstant } from "../app.stringconstant";
import { LoaderService } from "../services/loader.service";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  @ViewChild('Slides') slides: IonSlides;

  segment = '';
  index = 0;
  slideOpts = {
    effect: 'flip',
    zoom: false
  };
  cat_name : string;
  storeID: string;
  restaurantName: string;
  restaurantDistance : number;
  restaurantAddress: string;
  restaurantMinOrder: string;
  restaurantEstTime: string;
  currencySign: string;
  categoryList: any = [];
  categoryMenuList: any = [];
  bannerImg : any;
  restaurant_display_banner : string;
  res_marketbanner_img_code : any;
  banner_color : any;
  cart_count : number;
  globalCart : any =[];
  userID: number;
  resId: string;
  public TotalAmount = '0.00';
  lat:number;
	long: number;
  showCategoryList:boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private api: ApiService,
    private loaderService: LoaderService,
    public storage: Storage,
    private fun: FunctionsService,
    private navController: NavController,
    private event:Events) {
      this.storage.get('userLat').then((userLat) => { this.lat = userLat });
      this.storage.get('userLong').then((userLong) => { this.long = userLong });
      this.event.subscribe('TOTALCARTAMOUNT', (data)=>{
      console.log(data);
      setTimeout(()=>{ 
        this.revieworder();
        }, 1500);
    });
    this.event.subscribe('COUNTCART', (data)=>{
      setTimeout(()=>{ 
        this.CountCart();
        }, 1500);
    });
     this.event.subscribe('SEARCHLOCATION', (data)=>{
      console.log(data);
      setTimeout(()=>{             
        this.locationsearch();
      }, 200); 
    });
  }
  ngOnInit(){
    this.currencySign = StringConstant.currencySign;
    this.storeID = this.activatedRoute.snapshot.paramMap.get('storeID');
    this.storage.get('CURRENT_CATEGORY').then((CATEGORYNAME) => {
      this.cat_name = CATEGORYNAME;
    })
    this.storage.get('userLat').then((userLat) => { this.lat = userLat });
    this.storage.get('userLong').then((userLong) => { this.long = userLong });
    setTimeout(()=>{ 
      this.getDetails();
      this.CountCart();
      this.revieworder();
    }, 500);
  }

  CountCart()
  {
      this.storage.get('CARTCOUNT').then((val) => {
        console.log(val);
        if(val === null){
          this.cart_count=0;
        }else{
          this.cart_count=val;
        }
        
        console.log(this.cart_count);
      });
  }

  locationsearch(){
    this.storage.get('userLat').then((userLat) => { this.lat = userLat });
    this.storage.get('userLong').then((userLong) => { this.long = userLong });
  }

  revieworder(){
    this.storage.get('MY_GLOBAL_CART_RES_ID').then((restaurantID) => {
      this.resId = restaurantID;
    });
    this.storage.get('MY_GLOBAL_CART').then((val) => {
      this.globalCart = val;
      let formData = {                      
        "MY_GLOBAL_CART":this.globalCart,
        "MY_GLOBAL_CART_RES_ID":this.resId,
        "userid" : this.userID
      }
      this.api.post("review_order.php",formData).subscribe((resp: any) => {
        console.log(resp);
        if(resp.response.userData.cartCount != 0){
          this.TotalAmount = resp.response.userData.cartData.subtotal;
        }
        
        console.log(this.TotalAmount);

      })
    });
    
    
  }

  getDetails()
  {
    let apiRequestData = {
      "resid": this.storeID,
      // "userid": '1',
      "userid": this.userID,
      "lat": this.lat,
      "long": this.long,
      "maincateid": 0
    }
    // console.log(apiRequestData);
    this.storage.set('CURRENT_STORE', this.storeID);
    this.loaderService.show("Please_wait...");
    this.api.post("menu_list.php", apiRequestData).subscribe((res: any) => {
      //console.log(res);
      // this.loaderService.hideAll();   
      let myData = res;
      console.log("getDetails",myData);
    //console.log(JSON.stringify(myData));
      if(myData.response.success == 1){
        let restData = myData.response.userData.restData;
        // console.log(restData);
        this.restaurantName = restData.restaurant_name;
        this.restaurant_display_banner = restData.restaurant_display_banner;
        this.res_marketbanner_img_code = restData.res_marketbanner_img_code;
        this.banner_color = restData.banner_color;
        this.bannerImg = restData.banner_img;
        console.log(this.restaurant_display_banner);
        this.restaurantAddress = restData.address; 
        // this.restaurantAddress = restData.address;       
        // this.restaurantCall = myData.response.restaurant_phone;
        this.restaurantMinOrder = restData.restaurant_minorder_price;
        // this.restaurantDelCharge = myData.response.restaurant_delivery_charge;
        this.restaurantDistance = restData.miles;
        this.restaurantEstTime = restData.restaurant_estimated_time;
        // this.restaurant_booktable = myData.response.restaurant_booktable;
        // this.storage.set('MY_GLOBAL_CART_RES_ADDRESS', myData.response.full_address);
        // this.storage.set('MY_GLOBAL_CART_RES_DISTANCE', myData.response.miles);        
        // this.storage.set('MY_GLOBAL_CART_RES_LATITUDE', myData.response.latitude);
        // this.storage.set('MY_GLOBAL_CART_RES_LONGITUDE', myData.response.longitude);
        if(myData.response.userData.menuData.length>0){
          this.showCategoryList = true;
          this.categoryList = myData.response.userData.menuData;
          this.segment = myData.response.userData.menuData[0].maincatename;
          this.categoryMenuList = myData.response.userData.menuData;
        }
        console.log(this.res_marketbanner_img_code);
        // console.log("categoryMenuList = ", this.categoryMenuList);
        // console.log(this.categoryList);
        // this.isFav = myData.response.restaurant_fav;
        // console.log(myData.response.restaurant_fav);
        //this.isFav = "1";
              // console.log("FAV - ", this.isFav);
        // if(this.isFav == "1") {
        //   this.favChange = true;
        // }
        // console.log("favChange - ", this.favChange);

        // if (myData.category.length) {
        //   this.categoryList = myData.category;

        //   let apiRequestData = {
        //     "resid": this.restaurantID,
        //     "userid": this.userID,
        //     "lat": 50.8787878,
        //     "long": -51.787878,
        //     "nextpage": 1,
        //     "maincateid": 0
        //   }
        //   this.loaderService.show("Please wait...");
        //   this.api.post("menu_category_list.php", apiRequestData).subscribe((res: any) => {
        //     console.log("RESULT", res);
        //      this.loaderService.hideAll();   
        //     let myData = res;
        //     if(myData.status == 1) {
        //       this.categoryMenuList = myData.response.MenuData;
        //       console.log("categoryMenuList = ", this.categoryMenuList);
        //     }else{
        //       //alert('no');
        //     }
        //   }, err => {
        //      this.loaderService.hideAll();   
        //     console.error('ERROR', err);
        //   }); 
        // }
        this.loaderService.hideAll();   
      }else{
        // alert('no');
        this.loaderService.hideAll();  
      }
    }, err => {
      // this.loaderService.hideAll();   
      console.error('ERROR', err);
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    // const d = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.segment);
    // console.log(this.sponsored);
    
    // setTimeout(()=>{ 
    //     this.CountCart();
    //     this.revieworder();
    //     }, 1000);
  }

  seg(event) {
    this.segment = event.detail.value;
    console.log(this.segment);
  }

  drag() {
    let distanceToScroll = 0;
    for (let index in this.categoryList) {
      if (parseInt(index) < this.index) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  preventDefault(e) {
    e.preventDefault();
  }

  async change() {
    await this.slides.getActiveIndex().then(data => this.index = data);
    // this.segment = this.data[this.index].title;
    this.drag();
  }

  side_open() {
    this.menuCtrl.toggle('end');
  }

  update(i) {
    console.log(i);
    this.slides.slideTo(i).then((res) => console.log('responseSlideTo', res));
  }

  goToCartPage(){

    this.event.publish('EDITORDER', {
      type: 'reload'
    });

    console.log(this.TotalAmount);
    console.log(this.restaurantMinOrder);
    if(parseFloat(this.restaurantMinOrder) > parseFloat(this.TotalAmount)){
      this.loaderService.showToast("Please add more item to cart. Your item total must be " + StringConstant.currencySign + this.restaurantMinOrder +" or more than " + StringConstant.currencySign + this.restaurantMinOrder);
    }
    else{
      setTimeout(()=>{ 
        this.navController.navigateRoot(['/tabs/cart']); 
      }, 500);
    }
    //this.loaderService.hideAll();
    
    
  }
}
