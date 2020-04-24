
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FunctionsService } from '../functions.service';
// import { DataService, Product, HomeTab } from '../data.service';
import { Events, IonSlides, MenuController, NavController, IonContent, AlertController} from '@ionic/angular';
import { LoaderService } from "../services/loader.service";
import { StringConstant } from "../app.stringconstant";
import { ApiService } from "../services/api.service";
import { Storage } from "@ionic/storage";
// import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.page.html',
  styleUrls: ['./productdetail.page.scss'],
})
export class ProductdetailPage implements OnInit {

  @ViewChild('Slides') slides: IonSlides;
  @ViewChild('Content') content: IonContent;
  @ViewChild('slider') slider: IonSlides;

  index = 0;
  segment = '';
  slideOpts = {
    effect: 'flip',
    zoom: false
  };
  public items: any = [];

  // data: Array<HomeTab> = [];
  currencySign: string;
  // product: Product;
  menuID: string;
  resId: string;
  menuDetails: any = [];
  menuSizes: any = [];
  itemSize: number;
  ifAddons: string;
  addonData: any = [];
  selectMenuSize: number;
  str: string;
  globalCart : any =[];
  // description : string;
  private currentNumber = 1;
  public inc_dec = 1;
  public myString ="";
  cartCount : string;
  userID: string = "";
  isFav: string;
  favChange: boolean = false;

  constructor(
    private api: ApiService,
    private loaderService: LoaderService,
    public storage: Storage,
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private fun: FunctionsService,
    // private dataService: DataService,
    private event:Events,
    public alertController: AlertController,
    private navController: NavController) {

    // this.product = dataService.current_product;
    // this.data = dataService.item_tab;
    // this.segment = this.data[0].title;

    this.items = [
      { expanded: false, title: "Description " },
      { expanded: false, title: "Features" },
      { expanded: false, title: "Packaging" }
    ];

  }

  private increment () {
    this.currentNumber++;
  } 
  private decrement () { 
    console.log
    if (this.currentNumber > 1) 
    { 
      this.currentNumber--; 
    }
  }

  ngOnInit() {
    // console.log(this.product);
    this.currencySign = StringConstant.currencySign;
    this.menuID = this.activatedRoute.snapshot.paramMap.get('itemID');
    this.storage.get('CURRENT_STORE').then((restaurantID) => {
      console.log('CURRENT_STORE', restaurantID);
      this.resId = restaurantID;
      if(restaurantID!='')
          {
            let apiRequestData = {
              "resid": restaurantID,
              "menuid": this.menuID,
              "menusizeid": 0
            }

            this.loaderService.show("Please wait...");
            this.api.post("menu_details.php", apiRequestData).subscribe((res: any) => {
              //console.log()
              let myData = res;
              console.log(myData);
              this.menuDetails = myData.response.userData.menuData;
              console.log(this.menuDetails);
              this.ifAddons = myData.response.userData.menuData.menu_addons;
              this.addonData = myData.response.userData.menuData.addons;

              this.isFav = myData.response.userData.menuData.restaurant_fav;
              console.log(myData.response.userData.menuData.restaurant_fav);
              //this.isFav = "1";
                    console.log("FAV - ", this.isFav);
              if(this.isFav == "1") {
                this.favChange = true;
              }


              if(this.addonData && this.addonData.length === 0) {
                this.ifAddons = "No";
              }
              this.loaderService.hideAll();
            }, err => {
              console.error('ERROR', err);
              this.loaderService.hideAll();
            });
      }
    })
    // console.log(this.itemID);

  }


  menuSizeChange($event) {
        console.log("selectMenuSize - ", this.selectMenuSize);

        this.storage.get('CURRENT_STORE').then((restaurantID) => {
            console.log('CURRENT_STORE', restaurantID);
            if(restaurantID!='')
            {
                let apiRequestData = {
                    "resid": restaurantID,
                    "menuid": this.menuID,
                    "menusizeid": this.selectMenuSize
                }

                this.api.post("menu_details.php", apiRequestData).subscribe((res: any) => {
                    console.log(res);
                    let myData = res;
                    this.menuDetails = myData.response.userData.menuData;

                    this.ifAddons = myData.response.userData.menuData.menu_addons;
                    this.addonData = myData.response.userData.menuData.addons;

                    if (this.addonData && this.addonData.length === 0) {
                        this.ifAddons = "No";
                    }
                }, err => {
                    console.error('ERROR', err);
                });
            }
        });
    }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');

    this.storage.get('USER_ID').then((val) => {
     this.userID = val;
    });

  }

  async change() {
    await this.slides.getActiveIndex().then(d => this.index = d);
    // this.segment = this.data[this.index].title;
    this.drag();
  }

  onReviewClick(index) {
    // this.segment = this.data[index].title;
    this.index = index;
    this.slides.slideTo(index);
    this.content.scrollToTop();
    this.drag();

  }
  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  goToCart() {
    this.fun.navigate('/tabs/cart', false);
  }




  addToCart()
  {
    if(this.menuDetails.sizeoption == 'size' && this.selectMenuSize == undefined)
    {
      this.loaderService.showToast("Please select any size first");
      return false;
    }
    this.storage.get('MY_GLOBAL_CART').then((val) => {
      // console.log('cart', val);
      this.globalCart = val;   
    });
    this.storage.get('MY_GLOBAL_CART_RES_ID').then((val) => {
      console.log('cartresid', val);
      console.log('currentid', this.resId);
      if(val != this.resId && val != null) 
      {
        this.changeRest();
      }
      else
      {
        let formData = {
          "myResId": this.resId,
          "myMenuId": this.menuID,
          "myMenuName": this.menuDetails.menu_name,
          "myMenuPrice": this.menuDetails.menu_price,
          "myMenuQty": this.currentNumber,
          "myAddonList": this.myString,
          "mySizeId": this.selectMenuSize,
          //"myMenuType": this.userUpdateForm.value.password,
          "MY_GLOBAL_CART":this.globalCart,
          "MY_GLOBAL_CART_RES_ID":this.resId,
          "mySplInst": this.str
                        
        }
        this.loaderService.show("Please wait...");
        this.api.post("add_to_cart.php",formData).subscribe((data: any) => {
        // this.loaderService.hideAll();
        console.log("add_to_cart", data);
        if(data.response.success == '1'){
        console.log(data.response.message);
        this.storage.set('MY_GLOBAL_CART', data.response.userData.cart_exists);
       
        this.storage.set('MY_GLOBAL_CART_RES_ID', this.resId); 
        this.cartCount = data.response.userData.cart_count;
         this.storage.set('CARTCOUNT', this.cartCount);
          setTimeout(()=>{ 
              this.event.publish('COUNTCART', {
                type: 'cartcount'
              }); 
              this.event.publish('TOTALCARTAMOUNT', {
                type: 'cartamount'
              });
              this.event.publish('EDITORDER', {
                type: 'reload'
              });
          }, 500);
          setTimeout(()=>{ 
            this.loaderService.hideAll();
          }, 600);
          setTimeout(()=>{ 
            // this.loaderService.hideAll();
            this.navController.navigateRoot(['tabs/home/',this.resId]); 
          }, 700);
        }
        
          
          // 
          //            
        },err =>{
          // this.loaderService.hideAll();
          // console.log('ERROR', err);
        });
      }
    });
        //return false;
  }

  async changeRest() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'You have added some items from another Store.Do you want to remove those items from cart and add this new one?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            return false;
          }
        }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
                    this.storage.remove('MY_GLOBAL_CART_RES_ID');
                    this.storage.remove('MY_GLOBAL_CART');
                   this.storage.remove('CARTCOUNT');


                   // setTimeout(()=>{ 
                   //  this.event.publish('COUNTCART', {
                   //          type: 'cartcount'
                   //    }); 
                   //    }, 100);

              let formData = {
            "myResId": this.resId,
            "myMenuId": this.menuID,
            "myMenuName": this.menuDetails.menu_name,
            "myMenuPrice": this.menuDetails.menu_price,
            "myMenuQty": this.currentNumber,
            "myAddonList": this.myString,
            "mySizeId": this.selectMenuSize,
            //"myMenuType": this.userUpdateForm.value.password,
            "MY_GLOBAL_CART":null,
            "MY_GLOBAL_CART_RES_ID":this.resId,
            "mySplInst": this.str
            
        }
         console.log(formData);
             
              
              
          this.loaderService.show("Please wait...");
         this.api.post("add_to_cart.php",formData).subscribe((data: any) => {
            console.log("RESULT", data);

            this.storage.set('MY_GLOBAL_CART', data.response.userData.cart_exists);
            //alert(data.response.userData.cart_count);
            this.cartCount = data.response.userData.cart_count;

            this.storage.set('CARTCOUNT', this.cartCount);
             this.storage.set('MY_GLOBAL_CART_RES_ID', this.resId); 
           
            //alert(this.cartCount);
            setTimeout(()=>{ 
              this.event.publish('COUNTCART', {
                type: 'cartcount'
              }); 
              this.event.publish('TOTALCARTAMOUNT', {
                type: 'cartamount'
              });
              this.event.publish('EDITORDER', {
                type: 'reload'
              });
          }, 500);
            // this.event.publish('COUNTCART', {
            //         type: 'cartcount'
            //     }); 
            this.loaderService.hideAll();
           this.navController.navigateRoot(['tabs/home/',this.resId]); 
              


            
        }, err => {
          this.loaderService.hideAll();
            console.error('ERROR', err);
        });
          }
        }
      ]
    });

    await alert.present();
  }

  update(i) {
    this.slides.slideTo(i);
  }

  drag() {
    let distanceToScroll = 0;
    // for (const index in this.data) {
    //   if (parseInt(index) < this.index) {
    //     distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
    //   }
    // }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  seg(event) {
    this.segment = event.detail.value;
  }


  favIconChange(){
    console.log(this.userID);
    if(this.userID == null || this.userID==""){
      this.loaderService.showToast("Please login first to add store in your favourite list");
    }
    else{
      console.log(this.isFav);
      let apiRequestData = {
      "resid": this.resId,
      "userid": this.userID,
      "action": this.isFav === "1" ? "delete" : "add"
      }
      console.log('apiRequestData = ', apiRequestData);

      this.api.post("rest_favourite.php", apiRequestData).subscribe((res: any) => {
        console.log("RESULT", res);
        let myData = res;
        if(res.response.is_favourite == "1") {
          this.favChange = true;
          this.isFav = "1";
          this.loaderService.showToast(res.response.message);
        } 
        else 
        {    
          this.favChange = false;
          this.isFav = "0";
          this.loaderService.showToast(res.response.message);
        }
      }, err => {
        console.error('ERROR', err);
      });
    }
    

    

    

    
    //this.favChange = !this.favChange;
  }

}
