
import { Component, OnInit, ViewChild } from '@angular/core';
// import { Cart, DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { Events, ModalController, IonList, NavController, MenuController, AlertController } from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {ApiService} from "../services/api.service";
import {LoaderService} from "../services/loader.service";
import {API_RESPONSE, APP_NAME, StringConstant} from "../app.stringconstant";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import swal from 'sweetalert';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  checkoutForm:FormGroup;
  currencySign: string;
  globalCart : any =[];
  cartcount : string;
  resId: string;
  review: any = [];
  reviewCartdata: any = []; 
  restData: any = [];
  userID: number;
  TotalAmount:any;
  minOrderAmount:any;
  profile:any = [];
  profileData:any;
  userImage = "";
  userName="";
  userEmail="";
  currentAddress:any;
  checkOrderType = false;
  checkPaymentType = false;
  orderTypeVal:any;
  deliveryorder:boolean = false;
  paymentVal:any;
  checkoutDeliveryCharge:any = "0.00";
  tipsAmount:any = "0.00";
  instructionsVal:any;
  opentips : boolean = false;
  radio_grp: boolean = false;
  tips: boolean = false;
  tips_per: boolean = false;
  tips_in_amm: boolean = false;
  tips_in_per: boolean = false;
  afterDiscount:any;
  offer_fix : any = "0.00";
  offer_per : any = "0.00";
  couponDiscount:any = "0.00";
  serviceCharge:any = "0.00";
  discountAmount:any;
  tipVal:any ="";
  tipValPer:any = "";
  theCheckbox = false;
  isSubmitted = false;
  applyCouponEnable:boolean = false;
  CouponEnable:boolean = false;
  ShowApply:boolean = false;
  applyCouponName:any ;
  applyCouponDetails:any = [];
  CouponMsg : any;
  deliveryData:any;
  isDeliveryAvailable:any;
  lat:number;
  lng : number;
  sameasaddresschecked: boolean = false;

  @ViewChild('slidingList') slidingList: IonList;

  customAlertOptions: any = {
    header: 'Select Quantity',
    translucent: true
  };
  // segmentButtonClicked(ev: any) {
  //   console.log('Segment button clicked', ev);
  // }
  segmentButtonClicked(ordType) {
    console.log(ordType);
    if(ordType !== '')
    {
      this.orderTypeVal = ordType;
      this.checkOrderType = true;
      // if(ordType=='delivery')
      // {
      //     this.deliveryorder = true;
      //     this.TotalAmount =  parseFloat(this.reviewCartdata.subtotalWithTaxWithDelCharge) + parseFloat(this.tipsAmount) - parseFloat(this.couponDiscount);
      //     this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
      // }
      // else
      // {
      //     this.deliveryorder = false;
      //     this.TotalAmount =  parseFloat(this.reviewCartdata.subtotalWithTax) + parseFloat(this.tipsAmount) - parseFloat(this.couponDiscount);
      //     this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
      // }
    }
    else
    {
      this.orderTypeVal = "";
      this.checkOrderType = false;
    }
  }
  private buttonColor: string = "primary";
  private buttonColoro: string = "primary";
  public selected_project = { name: 'Delivery' };
  public selected_projecto = { name: 'Pickup' }
  //   someAction() {
  //       this.buttonColor = "danger";
  //   };
  //   someActiono() {
  //     this.buttonColor = "danger";
  // }
  public addProject(event) {
    event.stopPropagation();
    this.buttonColor = "danger";
    // alert('You Selected Cash on Delivery');
  }

  public deleteProject(event) {
    event.stopPropagation();
    this.buttonColoro = "danger";
    // alert('Delete project ');
  }
  qty = [];
  code = '';
  show = true;
  public Fixed: boolean = false;
  public Percentage: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    public storage: Storage,
    private api: ApiService,
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    private modalController: ModalController,
    private navController: NavController,
    private loaderService: LoaderService,
    private event:Events,
    public alertController: AlertController) {
    // this.event.subscribe('COUNTCART', (data)=>{
    //             console.log(data);
    //             setTimeout(()=>{ 
    //                       this.revieworder();
    //                       this.getCustomerProfile();
    //                  }, 1000);
    //           });
    this.event.subscribe('EDITORDER', (data)=>{
          console.log(data);
          setTimeout(()=>{             
                    this.editrevieworder();
               }, 500); 
      });
    this.event.subscribe('USERLOGOUT', (data)=>{
      console.log(data);
      setTimeout(()=>{
        this.getCustomerProfile();
      }, 500)
    });
    this.event.subscribe('USERLOGIN', (data)=>{
      console.log(data);
      setTimeout(()=>{
        this.getCustomerProfile();
      }, 500)
    });
    
    for (let i = 1; i <= 36; i++) { this.qty.push(i); }
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.currencySign = StringConstant.currencySign;
    this.checkoutForm = this.formBuilder.group({
          f_name: ['', Validators.required],
          l_name: ['', Validators.required],
          phone_no: ['', Validators.required],
          email: ['', Validators.pattern(StringConstant.myEMAIL_REGEXP)],
          address: ['', Validators.required],
          postcode: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          b_address: ['', Validators.required],
          b_postcode: ['', Validators.required],
          b_city: ['', Validators.required],
          b_state: ['', Validators.required]
      });
      this.storage.get('USER_ID').then((val) => {
        //console.log('User Id', val);
        this.userID = val;
      });
    // setTimeout(()=>{ 
    //   // this.getCustomerProfile();
    //   this.revieworder();
    // }, 1000); 
    // setTimeout(()=>{ 
    //   this.getCustomerProfile();
    //   // this.revieworder();
    // }, 1000); 
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.storage.get('USER_ID').then((val) => {
      this.userID = val;
      // if(this.userID == null){
      //   // console.log("hfjhgjf");
      //   // this.createAlert('Please Login to place your order');

      // }
      
      
    });
    // setTimeout(()=>{ 
    //   this.getCustomerProfile();
    //   // this.revieworder();
    // }, 1000); 
    // this.revieworder();
    setTimeout(()=>{ 
      // this.getCustomerProfile();
      this.revieworder();
      // this.getCustomerProfile();
    }, 1000); 
    setTimeout(()=>{ 
      this.getCustomerProfile();
      // this.revieworder();
    }, 3000);
  }

  choosePayment(ptype){
    if(ptype !== '')
    {
      this.paymentVal = ptype;
      this.checkPaymentType = true;
    }
    else
    {
      this.paymentVal = "";
      this.checkPaymentType = false;
    }
  }

  getCustomerProfile(){
    this.storage.get('USER_ID').then((val) => {
      this.userID = val;
      if(this.userID == null){
        // console.log("hfjhgjf");
        this.createAlert('Please Login to place your order');

      }
      else{
        console.log(this.userID);
      this.profileData = {userid: this.userID};
      console.log(this.profileData);
      this.api.post("user_profile.php", this.profileData).subscribe((resp:any)=>{
        console.log("Profile_Data", resp.response);
              if (resp.response.success == '1') {
                  this.profile = resp.response.userData;
                  // console.log(this.profile);
              } else {
                  
                  this.profile = '';
              }
          },(err) => { 
            // this.getCustomerProfile();
            console.log("error", err);
              
          });
      }
      
    });
    // if(this.userID !== null){
      
      // console.log(this.userID);
      
    // }
    
  }



  editrevieworder(){
    this.storage.get('MY_GLOBAL_CART').then((val) => {
      this.globalCart = val;
      this.revieworder();
    });
  }
  revieworder(){
    this.storage.get('MY_GLOBAL_CART').then((val) => {
      this.globalCart = val;
    });
    this.storage.get('MY_GLOBAL_CART_RES_ID').then((restaurantID) => {
      this.resId = restaurantID;
    });
    
    setTimeout(()=>{
      let formData = {                      
        "MY_GLOBAL_CART":this.globalCart,
        "MY_GLOBAL_CART_RES_ID":this.resId,
        "userid" : this.userID
      }
      // console.log(formData);
      // this.loaderService.show("Please wait...");
      this.api.post("review_order.php",formData).subscribe((resp: any) => {
        // this.loaderService.hideAll();
        console.log("RESULT", resp);
        this.review = resp.response.userData.cart;
        this.cartcount = resp.response.userData.cartCount;
        console.log(this.review);
        // console.log(data);
        this.reviewCartdata = resp.response.userData.cartData;
        this.TotalAmount = resp.response.userData.cartData.subtotalWithTax;
        
        // this.rewardAmount = data.response.userData.rewardAmount;
        // this.cardList= data.response.cardList;
        this.restData = resp.response.userData.restData;
        this.serviceCharge = resp.response.userData.restData.store_tax;
        this.minOrderAmount = resp.response.userData.restData.restaurant_minorder_price;
        // this.getCustomerProfile();
        // this.paymenttype = data.response.payment_type;

        if(this.applyCouponEnable)
        { 
              // alert('coupon');
              console.log(this.applyCouponDetails.userData.type);
             
              if (this.applyCouponDetails.userData.type == 'per') {
                // this.offer_fix = 0;
                this.offer_per = this.applyCouponDetails.userData.offer;
                let discountAmount = parseFloat(this.reviewCartdata.subtotal) * parseFloat(this.applyCouponDetails.userData.offer) / 100;

                this.couponDiscount = discountAmount;
                this.couponDiscount = parseFloat(this.couponDiscount).toFixed(2);
                 console.log(this.couponDiscount);
                if(this.TotalAmount>discountAmount){
                  this.afterDiscount = this.TotalAmount - discountAmount;
                }
                else{
                  this.afterDiscount = 0.00;
                }
                
                this.TotalAmount = parseFloat(this.afterDiscount).toFixed(2);
                console.log(this.TotalAmount);

              }
              else if (this.applyCouponDetails.userData.type == 'fix') { 
                // this.offer_per = 0;
                this.offer_fix = this.applyCouponDetails.userData.offer;
                let discountAmount = parseFloat(this.applyCouponDetails.userData.offer);
                this.couponDiscount = discountAmount;

                // this.afterDiscount = this.TotalAmount - discountAmount;
                if(this.TotalAmount>discountAmount){
                  this.afterDiscount = this.TotalAmount - discountAmount;
                }
                else{
                  this.afterDiscount = 0.00;
                }
                this.couponDiscount = parseFloat(this.couponDiscount).toFixed(2);
                 console.log(this.couponDiscount);
               
                this.TotalAmount = parseFloat(this.afterDiscount).toFixed(2);
              }
              if(this.tips){
                if(this.tips_in_amm){
                  console.log("tips_in_amm");
                  console.log("this.tipsAmount", this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
                }
                if(this.tips_in_per){
                  console.log("tips_in_per");
                  console.log("this.tipsAmount", this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
                }
              }
              // if(this.forceopen)
              //   {
              //     this.opentips = true;
                 
              //       this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.tipsAmount);
              //       this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
              //       this.radio_grp= true;
              //       //this.fixed_tips();
              //   }
          }
          else{
            if(this.tips){
                if(this.tips_in_amm){
                  console.log("tips_in_amm");
                  console.log("this.tipsAmount", this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
                }
                if(this.tips_in_per){
                  console.log("tips_in_per");
                  console.log("this.tipsAmount", this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.tipsAmount);
                  this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
                }
              }
          }
          console.log(this.TotalAmount);

      })
    }, 100);
  }

  editCart(event, item){
    // console.log(event);
    // console.log(event.detail.value);
    // console.log(item);
    this.storage.get('MY_GLOBAL_CART').then((val) => {
      // console.log('cart', val);
      this.globalCart = val;   
    });
    this.storage.get('MY_GLOBAL_CART_RES_ID').then((restaurantID) => {
      // console.log('MY_GLOBAL_CART_RES_ID', restaurantID);
      this.resId = restaurantID;
      //console.log(this.resId);
    });
    let formData = {
            "myResId": item.res_id,
            "myMenuId": item.id,
            "myMenuName": item.name,
            "myMenuPrice": item.price,
            "myMenuQty": event.detail.value,
            "myAddonList": item.addons,
            "mySizeId": item.size_id,
            "editCartID": item.key,
            "MY_GLOBAL_CART":this.globalCart,
            "MY_GLOBAL_CART_RES_ID":this.resId,
            "mySplInst": item.instruction
            
        }
    console.log(formData);
      this.loaderService.show("Please wait...");
      this.api.post("add_to_cart.php",formData).subscribe((data: any) => {
    // console.log("RESULT", data);
      console.log("add_to_cart", data);
        if(data.response.success == '1'){
          this.storage.set('MY_GLOBAL_CART', data.response.userData.cart_exists);
          //alert(data.response.userData.cart_count);
          this.cartcount = data.response.userData.cart_count;
          this.storage.set('CARTCOUNT', this.cartcount);
          //alert(this.cartCount);
          this.event.publish('TOTALCARTAMOUNT', {
                      type: 'cartamount'
                    });
          this.event.publish('COUNTCART', {
            type: 'cartcount'
          }); 
          this.event.publish('EDITORDER', {
            type: 'reload'
          });
          // setTimeout(()=>{ 
            // this.navController.navigateRoot(['revieworder']);
            this.loaderService.hideAll();
          // }, 200);
        }
    
    //this.loaderService.hideAll();
    // setTimeout(()=>{ 
    // this.navController.navigateRoot(['revieworder']);
    // }, 500);
            
              
            
        }, err => {
          // this.loaderService.hideAll();
            console.error('ERROR', err);
    });
  }


  removeFromCart(menuId,cartKey)
  {
    this.removeItemConfirm(menuId,cartKey);   
  }

  async removeItemConfirm(menuId,cartKey) {
    //console.log(menuId);
    const alert = await this.alertController.create({
      //header: 'Confirm!',
      message: 'Remove this item from cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Remove',
          handler: () => {
            //console.log('Confirm Okay');
            let formData = {                      
                    "MY_GLOBAL_CART":this.globalCart,
                    "MY_GLOBAL_CART_RES_ID":this.resId,
                    "editCartID":cartKey,
                    "myMenuId":menuId           
                }
                // console.log(formData);
                this.loaderService.show("Please wait...");
                this.api.post("remove_from_cart.php",formData).subscribe((data: any) => {
                    console.log("RESULT", data);
                    
                    this.storage.set('MY_GLOBAL_CART', data.response.userData.cart_exists);
                    this.storage.set('CARTCOUNT', data.response.userData.cart_count);
                    this.loaderService.hideAll();
                    if(data.response.userData.cart_count == 0)
                    {
                      //this.noItemFound();

                      this.loaderService.showToast('Your cart is empty. Please add some items in the cart first');
                      //this.loaderService.showToast(data.response[0].message);
                      // this.storage.get('USER_NAME').then((userName) => {
                      //   this.userName = userName;
                      // });
                      // this.storage.get('USER_IMAGE').then((userImage) => {
                      //     this.userImage = userImage;
                      //    });
                      // this.storage.get('USER_EMAIL').then((userEmail) => {
                      //     this.userEmail = userEmail; 
                      //    });
                      // this.storage.get('searchLocation').then((searchLocation) => {
                      //     this.currentAddress = searchLocation; 
                      //    });
                      
                      // this.storage.clear();

                      // this.storage.set('USER_NAME',this.userName);
                      // this.storage.set('USER_IMAGE',this.userImage);
                      // this.storage.set('USER_EMAIL',this.userEmail);
                      // this.storage.set('USER_ID',this.userID);
                      this.event.publish('COUNTCART', {
                              type: 'cartcount'
                          });
                      this.event.publish('EDITORDER', {
                          type: 'reload'
                        });
                      this.event.publish('TOTALCARTAMOUNT', {
                        type: 'cartamount'
                      });
                      setTimeout(()=>{ 
                         this.storage.set("searchLocation", this.currentAddress);
                         this.navController.navigateRoot(['tabs/mainhome']);
                      }, 500);
                     
                      
                      

                     }
                     else
                     {
                      this.loaderService.showToast(data.response.message);
                      this.globalCart = this.getFromStorageAsync();
                      console.log("getFromStorageAsync", this.globalCart);
                      // setTimeout(()=>{ 
                       // this.revieworder1();
                        this.event.publish('EDITORDER', {
                          type: 'reload'
                        });
                        this.event.publish('COUNTCART', {
                              type: 'cartcount'
                          });
                        this.event.publish('TOTALCARTAMOUNT', {
                        type: 'cartamount'
                      });

                      // }, 100); 
                      
                    }
                      
                      
                }, err => {
                    console.error('ERROR', err); 
                });
          }
        }
      ]
    });

    await alert.present();
  }

  async getFromStorageAsync(){

        return await this.storage.get('MY_GLOBAL_CART');

  }


  revieworder1(){
    this.storage.get('MY_GLOBAL_CART').then((val) => {
      // console.log('cart', val);
      this.globalCart = val;
    });
    this.storage.get('MY_GLOBAL_CART_RES_ID').then((restaurantID) => {
      // console.log('MY_GLOBAL_CART_RES_ID', restaurantID);
      this.resId = restaurantID;
      //console.log(this.resId);
    });
    this.loaderService.show("Please wait...");
    // console.log(this.globalCart);
    setTimeout(()=>{
      let formData = {                      
        "MY_GLOBAL_CART":this.globalCart,
        "MY_GLOBAL_CART_RES_ID":this.resId,
        "userid" : this.userID
      }
      // console.log(formData);
      this.api.post("review_order.php",formData).subscribe((resp: any) => {
        this.loaderService.hideAll();
        console.log("RESULT", resp);
        this.review = resp.response.userData.cart;
        this.cartcount = resp.response.userData.cartCount;
        // console.log(this.review);
        // console.log(data);
        this.reviewCartdata = resp.response.userData.cartData;
        this.TotalAmount = resp.response.userData.cartData.subtotalWithTax;
        // this.rewardAmount = data.response.userData.rewardAmount;
        // this.cardList= data.response.cardList;
        this.restData = resp.response.userData.restData;
        // this.getCustomerProfile();
        // this.paymenttype = data.response.payment_type;

      })
    }, 100);
  }


  doCheckout(){
    // this.isSubmitted = true;
    // if (!this.checkoutForm.valid) {
    //   console.log('Please provide all the required values!')
    //   return false;
    // } else {
    //   console.log(this.checkoutForm.value)
    // }
    // console.log(this.minOrderAmount);
    // console.log(this.TotalAmount);
    if(parseFloat(this.minOrderAmount) > parseFloat(this.TotalAmount)){
      this.loaderService.showToast("Please add more item to cart your item total must be more than " + StringConstant.currencySign + this.minOrderAmount);
    }
    else if(this.checkOrderType == false)
    {
      this.loaderService.showToast("Please choose the order type");
    }
    else if(this.checkPaymentType == false)
    {
      this.loaderService.showToast("Please choose a payment method");
    }
    else{
      if(this.orderTypeVal == 'delivery')
      {
        this.checkDeliveryArea();
      //   //{

      //     //console.log(response)
      //   //   if(response)
      //   //   {
      //       // this.finalCheckout(); 
      //        //return false;
      //   //   }
      //   // }
      }
      else
      {
        this.finalCheckout();
      }
      // this.finalCheckout();
    }
  }


  checkDeliveryArea(){
  //   //console.log(this.checkoutForm.value.address);
    this.deliveryData = {customer_street: this.checkoutForm.value.address, customer_zip: this.checkoutForm.value.postcode, customer_city: this.checkoutForm.value.city, customer_state: this.checkoutForm.value.state, order_restaurant_id: "171"};
    console.log(this.deliveryData);

    this.loaderService.show("Checking delivery area...");
  //   let minPrice = this.reviewCartdata.subtotalWithTax;
    this.api.post("check_Delivery_Area.php", this.deliveryData).subscribe((data:any)=>{
            this.loaderService.hideAll();
            console.log("check_Delivery_Area",data);
            if (data.response.isDeliveryAvailable) {
              this.checkoutDeliveryCharge = data.response.deliveryCharge;
              this.isDeliveryAvailable = true;
              
              // this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.checkoutDeliveryCharge);
              // this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
              // console.log(this.TotalAmount);
              // this.finalCheckout();
              this.ShowDeliveryAlert();
  //           //   // callback(true);
            }
            else
            {
              this.ShowNoDeliveryAlert();
              // this.loaderService.showToast("Delivery is not available in provided address! Please change your location.");
              // this.isDeliveryAvailable = false;
              // return false;
  //           //   // callback(false);
            }
  //           //this.loaderService.hideAll();
        },(err) => {
  //         this.loaderService.showToast("Something went is wrong! Please try it later.");
  //         // callback(false);
  //           //this.loaderService.hideAll();
        });
  }


  finalCheckout(){
    //console.log("this is the final checkout..");
    // console.log(this.cardDetails.amount);
    if (this.orderTypeVal == 'delivery') {
        // this.checkoutDeliveryCharge = this.reviewCartdata.deliveryCharge;        
        this.checkoutDeliveryCharge = this.checkoutDeliveryCharge; 
        this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.checkoutDeliveryCharge);
        this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);  

    }
    else 
    {
        this.checkoutDeliveryCharge = '0.00';
        this.TotalAmount = parseFloat(this.TotalAmount) + parseFloat(this.checkoutDeliveryCharge);
        this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2); 
    }
    // if(this.paymentVal == 'stripe')
    // {
    //     if(this.isNewCard)
    //     {
    //   //console.log(this.cardDetails.cardNumber);
    //         if(this.cardDetails.cardNumber == undefined  || this.cardDetails.cardExpMonth == undefined  || this.cardDetails.cardExpYear == undefined  || this.cardDetails.cardCVV == undefined)
    //         {
    //               this.loaderService.showToast("Please fill up card details");
    //               return false;
    //         }
    //         else
    //         {

    //           this.stripe.setPublishableKey(StringConstant.STRIPE_KEY);
    //           //console.log("STRIPE_KEY - ", StringConstant.STRIPE_KEY);
    //           this.stripeDetails = {
    //             //number: '4242424242424242',
    //             "number": this.cardDetails.cardNumber, //'4242424242424242',
    //             "expMonth": this.cardDetails.cardExpMonth, //12,
    //             "expYear": this.cardDetails.cardExpYear, //2020,
    //             "cvc": this.cardDetails.cardCVV //'220'
    //           }
    //           //console.log(this.cardDetails);
    //             this.stripe.createCardToken(this.stripeDetails)
    //             .then(token => {
    //               //console.log(token);
    //               this.stripeError = "";
    //               //this.loaderService.hideAll();
    //               this.stripeToken = token.id;
    //               this.saveorder();
    //             })
    //             .catch(error => {
    //               //console.error("Stripe error 1 - ", error.message);
    //               //console.error("Stripe error - ", error);
    //               this.stripeError = error.message;
    //               //this.loaderService.hideAll();
    //               this.loaderService.showToast(this.stripeError);
    //               return false;
    //             });

    //         }
    //     }
    //     else
    //     {
    //       if(this.customerStripeId == "")
    //       {
    //           this.loaderService.showToast("Please select card");
    //               return false;
    //       }
    //       else
    //       {
    //         console.log(this.customerStripeId);
    //           this.saveorder();
    //           return false;
    //       }
    //     }
    // }
    if(this.paymentVal == 'cod')
    {
      this.saveorder();
    }
    // else if(this.paymentVal == 'paypal')
    // {
    //     this.paypalPayment();
    // }
    else
    {
      this.saveorder();
    }
    
  }

  saveorder(){
    let formData = {
            "customer_name": this.checkoutForm.value.f_name,
            "customer_lastname": this.checkoutForm.value.l_name,
            "customer_phone": this.checkoutForm.value.phone_no,
            "customer_crossstreet": this.checkoutForm.value.address+', '+this.checkoutForm.value.city+', '+this.checkoutForm.value.state+', '+this.checkoutForm.value.postcode,
            "customer_zipcode": this.checkoutForm.value.postcode,
            "customer_city": this.checkoutForm.value.city,
            "customer_state": this.checkoutForm.value.state,
            // "customer_password": this.checkoutForm.value.password,
            "customer_email": this.checkoutForm.value.email,
            "totalAmount" : this.TotalAmount,
            "cart" : this.globalCart,
            "res_id" : this.resId,
            "user_id" : this.userID,
            "order_time" : "",
            "order_date" : "",
            "DeliveryCharge" : this.checkoutDeliveryCharge,
            "payment_type" : this.paymentVal,
            "customer_buildtype" : "",
            "customer_landmark" : "",
            "tip" : this.tipsAmount,
            "offer_fix" : this.offer_fix,
            "offer_per" : this.offer_per,
            "offervalue" : this.couponDiscount,
            "coupon_code" : this.code,
            "orderType" : this.orderTypeVal,
            "sub_total" : this.reviewCartdata.subtotalWithTax,
            "item_total" : this.reviewCartdata.subtotal,
            "instructionsVal" : this.instructionsVal,
            "total" : this.TotalAmount,
            "checkout_asap" : "",
            "tax_per" : this.serviceCharge,
            "taxvalue" : this.serviceCharge,
        }
        console.log(formData);
        this.loaderService.show("Please wait...");
        this.api.post("checkout.php",formData).subscribe((data: any) => {
            console.log("RESULT", data);
             
             if(data.response) {
                    if (data.response[0].success === 1) {

                      console.log(data.response[0].message);
                    this.storage.get('USER_NAME').then((userName) => {
                      this.userName = userName;
                         });
                      this.storage.get('USER_IMAGE').then((userImage) => {
                          this.userImage = userImage;
                         });
                      this.storage.get('USER_EMAIL').then((userEmail) => {
                          this.userEmail = userEmail; 
                         });
                      this.storage.get('searchLocation').then((searchLocation) => {
                          this.currentAddress = searchLocation; 
                         });
                      this.storage.get('userLat').then((userLat) => { this.lat = userLat });
                      this.storage.get('userLong').then((userLong) => { this.lng = userLong });
                      
                      this.storage.clear();

                      
                      // this.revieworder();
                      if(this.applyCouponEnable)
                      {
                        this.discardCoupon();
                      }
                      this.tips = false;
                      this.radio_grp = false;
                      this.tips_in_per = false;
                      this.tips_in_amm = false;
                      this.tipsAmount = "0.00";
                      this.tipVal = "";
                      this.tipValPer = "";
                      setTimeout(()=>{
                        this.storage.set('USER_NAME',this.userName);
                        this.storage.set('USER_IMAGE',this.userImage);
                        this.storage.set('USER_EMAIL',this.userEmail);
                        this.storage.set('USER_ID',this.userID);
                        this.storage.set('userLat',this.lat);
                        this.storage.set('userLong',this.lng);
                        this.storage.set("searchLocation", this.currentAddress);
                        this.event.publish('LOCATIONSEARCH', {
                              type: 'locationsearch',
                              searchLocation: this.currentAddress,
                              Latitude : this.lat,
                              longitude : this.lng
                          });
                      }, 500);
                      setTimeout(()=>{ 
                        
                        // this.storage.set('USER_NAME',this.userName);
                        // this.storage.set('USER_IMAGE',this.userImage);
                        // this.storage.set('USER_EMAIL',this.userEmail);
                        // this.storage.set('USER_ID',this.userID);
                        // this.revieworder();
                         // this.navController.navigateRoot(['/tabs/mainhome']);
                         this.loaderService.hideAll();
                         this.done();
                      }, 4000);
                      
                      
        //               this.event.publish('COUNTCART', {
        //                       type: 'cartcount'
        //                   });
                     
        //                 // myService.myAlert(data.response[0].message);
        //             }
        //               else {
        //              console.log(data.response[0].message);

                      // this.loaderService.showToast(data.response[0].message);
                    }
              }
            
        }, err => {
          this.loaderService.hideAll();
         console.log('errrrr');
        //    this.loaderService.hide();
        //     //console.error('ERROR', err);
        });
  }

  async open_modal(b) {
    let modal;
    if (b) {
      modal = await this.modalController.create({
        component: InfomodalPage,
        // componentProps: { value: this.dataService.terms_of_use, title: 'Terms of Use' }
        componentProps: { content_id: "4"}
      });
    } else {
      modal = await this.modalController.create({
        component: InfomodalPage,
        // componentProps: { value: this.dataService.privacy_policy, title: 'Privacy Policy' }
        componentProps: { content_id: "2"}
      });
    }
    return await modal.present();
  }

  calculate(i) {
    let res = 0;
    if (i === 0) {
      // for (const j of this.data) {
      //   if (j.product.offer) {
      //     res += this.fun.calculate(j.product.cost_price, j.product.discount) * j.quantity;
      //   } else {
      //     res += j.product.cost_price * j.quantity;
      //   }
      // }
    }
    if (i === 1) {
      // for (const j of this.data) {
      //   res += j.product.shipping;
      // }
    }
    return res;
  }


  fix(a) {
    return a.toFixed(2);
  }

  add() {
    const res = this.calculate(1) + this.calculate(0);
    return res;
  }

  browse() {
    this.storage.get('MY_GLOBAL_CART_RES_ID').then((restaurantID) => {
      // console.log('MY_GLOBAL_CART_RES_ID', restaurantID);
      this.resId = restaurantID;
      console.log("MY_GLOBAL_CART_RES_ID", this.resId);


      // console.log(this.resId);
      if(this.resId ===null){
        // console.log("ok null");
        this.fun.navigate('/tabs/mainhome', false);
      }
      else{
        this.fun.navigate('/tabs/home/'+this.resId, false);
      }
      // if(this.resId != "" || this.resId !=null){
      //   this.fun.navigate('/tabs/home/'+this.resId, false);
      // }
      // else{
      //   this.fun.navigate('/tabs/mainhome', false);
      // }
    });
    
    
  }

  // async remove(j) {
  //   this.fun.removeConform().then(res => {
  //     console.log('res conform', res);
  //     if (res === 'ok') {
  //       this.slidingList.closeSlidingItems();
  //       // this.data.splice(j, 1);
  //       // if (this.data.length === 0) {
  //       //   this.show = !this.show;
  //       // }
  //     }
  //   });
  // }
  tipsType(getType) {
    console.log("getType", getType);
    if (getType == "per") {
      this.Fixed = false;
      this.Percentage = true;
    } else {
      this.Fixed = true;
      this.Percentage = false;
    }
  }
  done() {
    // swal("Thank You", "Your order has been placed successfully", "success");
    // this.fun.navigate('/storeview', false);
    // this.fun.navigate('/tabs/mainhome', false);
    this.presentAlertConfirm();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Thank You',
      message: 'Your order has been placed successfully',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-round',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.fun.navigate('/tabs/mainhome', false);
          }
        },

      ]

    });

    await alert.present();

  }

  hidetips(event){
    // console.log(event.target.checked);
    if(event.target.checked){
      this.tips = true;
      this.radio_grp = true;
    }else{
      this.tips = false;
      this.radio_grp = false;
      this.tips_in_per = false;
      this.tips_in_amm = false;
      this.tipsAmount = "0.00";
      this.tipVal = "";
      this.tipValPer = "";
      // setTimeout(()=>{
        this.revieworder();
      // },100);
    }
    
  }

  updateCart(tipVal)
  {
    let subTotal = "";
    if(this.deliveryorder)
    {
      subTotal = this.reviewCartdata.subtotalWithTaxWithDelCharge;
    }
    else
    {
      subTotal = this.reviewCartdata.subtotalWithTax;
    }
    let subtotalWithTips = parseFloat(subTotal) + parseFloat(tipVal) - parseFloat(this.couponDiscount);
    this.TotalAmount = subtotalWithTips;
    this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
  }

  updateCartPerTip(tipVal)
  {
    //alert(tipVal);
      if(this.tipValPer == null)
      {
          this.tipValPer = '0.00';
          let subTotal = "";
          if(this.deliveryorder)
          {
              subTotal = this.reviewCartdata.subtotalWithTaxWithDelCharge;
          }
          else
          {
              subTotal = this.reviewCartdata.subtotalWithTax;
          }
          return false;
      }
      let subTotal = "";
      if(this.deliveryorder)
          {
              subTotal = this.reviewCartdata.subtotalWithTaxWithDelCharge;
          }
          else
          {
              subTotal = this.reviewCartdata.subtotalWithTax;
          }
           console.log(subTotal);
      this.tipsAmount = parseFloat(tipVal).toFixed(2);
      //console.log(this.reviewCartdata.subtotalWithTax);
      
      //console.log(subTotal);
      let subtotalWithTips = (parseFloat(subTotal) * parseFloat(tipVal))/100;
      //console.log(subtotalWithTips);
      this.tipsAmount = subtotalWithTips;
      let finalSubtotalWithTips  = parseFloat(subTotal) + subtotalWithTips - parseFloat(this.couponDiscount);
      //console.log(finalSubtotalWithTips);
      this.TotalAmount =  finalSubtotalWithTips;
      this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
  }

  fixed_tips() {
    
    this.tips = true;
    this.tips_per = false;
    this.tips_in_amm = true;
    this.tips_in_per = false;
  }
  percentage_tips() {

    this.tips = true;
    this.tips_per = false;
    this.tips_in_amm = false;
    this.tips_in_per = true;
  }

  EnterFixTips(){
    // console.log(typeof this.tipVal );
    if(typeof this.tipVal !== "number"){
      this.tipVal = "0.00";
    }
    this.tipsAmount = parseFloat(this.tipVal).toFixed(2);
    // console.log(this.tipsAmount);
    if(this.applyCouponEnable)
     {
        this.updateCart(this.tipsAmount);
        // this.updateCart(this.tipVal);
        return false;
     }
    if(this.tipVal == null)
    {
          if(this.deliveryorder)
        {
            this.TotalAmount = this.reviewCartdata.subtotalWithTaxWithDelCharge;
            this.tipsAmount ="0.00";
            return false;
        }
        else
        {
            this.TotalAmount = this.reviewCartdata.subtotalWithTax;
            //console.log(this.TotalAmount);
            this.tipsAmount = "0.00";
            return false;
        }
    }
    let subTotal = "";
    if(this.deliveryorder)
    {
      subTotal = this.reviewCartdata.subtotalWithTaxWithDelCharge;
    }
    else
    {
      subTotal = this.reviewCartdata.subtotalWithTax;
    }
    let subtotalWithTips = parseFloat(subTotal) + parseFloat(this.tipVal);
    this.TotalAmount = subtotalWithTips;
    this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
  }

  EnterPerTips(){
    this.tipsAmount = parseFloat(this.tipValPer).toFixed(2);
    // console.log(this.tipsAmount);
    if(this.applyCouponEnable)
    {
      this.updateCartPerTip(this.tipValPer);
      return false;
    }
    if(this.tipValPer == null)
    {
      this.tipValPer = '0.00';
    }
    let subTotal = "";
    if(this.deliveryorder)
    {
      subTotal = this.reviewCartdata.subtotalWithTaxWithDelCharge;
    }
    else
    {
      subTotal = this.reviewCartdata.subtotalWithTax;
    }
    // console.log(subTotal);
    let subtotalWithTips = (parseFloat(subTotal) * parseFloat(this.tipValPer))/100;
    this.tipsAmount = subtotalWithTips;
    this.tipsAmount = parseFloat(this.tipsAmount).toFixed(2);
    // console.log(this.tipsAmount);
    let finalSubtotalWithTips  = parseFloat(subTotal) + subtotalWithTips;
    this.TotalAmount =  finalSubtotalWithTips;
    this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
  }

  sameHomeAddress(event){
    // console.log(event);
    // console.log(this.checkoutForm.value);
    // console.log(event.target.checked);
    // console.log(this.checkoutForm.value.address);
    if(event.target.checked){
      this.sameasaddresschecked = true;
      // alert(this.profile.customer_street);
      // this.bill_address = "jgjfhg";
      this.profile.b_address = this.checkoutForm.value.address;
      this.profile.b_postcode = this.checkoutForm.value.postcode;
      this.profile.b_city = this.checkoutForm.value.city;
      this.profile.b_state = this.checkoutForm.value.state;
    }
    else{
      this.sameasaddresschecked = false;
      this.profile.b_address = '';
      this.profile.b_postcode = '';
      this.profile.b_city = '';
      this.profile.b_state = '';
      // this.bill_address = "jgjfhhkghj";
    }
    // console.log(this.profile);
  }
  

  async createAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: '',
      message: msg,
      buttons: [{
          text: 'Ok',
          handler: () => {
            // console.log('Confirm Okay');
            this.fun.navigate('/tabs/login/cart', true);

          }
        }]
    });

    await alert.present();
  }

  applyCoupon(){
    // console.log("ok");
    // console.log(this.code);
    if(this.code == ""){
      this.loaderService.showToast('Please input Coupon Code');
    }
    else{
      console.log(this.resId);
      console.log(this.code);
      let apiRequestData = {
            "resid": this.resId,
            "couponCode" : this.code,
            "customer_id": this.userID,
      }
      this.loaderService.show("Please wait...");

      this.api.post("apply_coupon.php", apiRequestData).subscribe((res: any) => {
        console.log(res);
            let myData = res;
            if(myData.response.success == 1) {
              this.loaderService.hideAll();
              // this.coupons = myData.response.coupons;
              this.applyCouponEnable = true;
              this.CouponEnable = true;
              this.ShowApply = true;
              this.applyCouponDetails = myData.response;
              setTimeout(()=>{
                this.revieworder();
              }, 500);
              
            }
            if(myData.response.success == 0) {
              this.loaderService.hideAll();
              // this.storage.remove('previousTips');
              // this.storage.remove('FixOrPer');
              // this.storage.remove('fixPerTip');
              this.code = "";
              this.ShowApply = false;
              this.CouponEnable = false;
              this.applyCouponEnable = true;
              // this.coupons = myData.response.coupons;
              this.loaderService.showToast(myData.response.message);
            }
            this.CouponMsg = myData.response.message;
            // console.log(this.CouponMsg);
            // this.coupons();
            // this.loaderService.hide();
          }, err => {
            this.loaderService.hideAll();
            console.error('ERROR', err);
            // this.loaderService.hide();
          });
    }
  }

  discardCoupon(){
    this.code = "";
      this.applyCouponEnable =false;
      this.couponDiscount ="0.00";
      this.ShowApply = false;
      setTimeout(()=>{
        this.revieworder();
      }, 500);
      // this.TotalAmount = parseFloat(subTotal) + parseFloat(this.tipsAmount);
      // this.TotalAmount = parseFloat(this.TotalAmount).toFixed(2);
      // this.tipsAmount = parseFloat(this.tipsAmount).toFixed(2); 
    }


    async ShowDeliveryAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'According to your delivery address, delivery charge is '+ this.currencySign+ this.checkoutDeliveryCharge +' .  Continue placing this order?',
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
              this.finalCheckout();
                  
              
          }
        }
      ]
    });

    await alert.present();
  }
  async ShowNoDeliveryAlert() {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: 'Delivery is not available in provided address! Please change your location',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  homeaddress(){
    // console.log(this.checkoutForm.value);
    if(this.sameasaddresschecked == true){
      this.profile.b_address = this.checkoutForm.value.address;
      this.profile.b_postcode = this.checkoutForm.value.postcode;
      this.profile.b_city = this.checkoutForm.value.city;
      this.profile.b_state = this.checkoutForm.value.state;
    }
    
    // console.log("ok");
    // this.profile.b_address = this.checkoutForm.value.address;
  }

  billaddress(){
    // console.log(this.checkoutForm.value);
    if(this.sameasaddresschecked == true){
        this.profile.customer_crossstreet = this.checkoutForm.value.b_address;
        this.profile.customer_zip = this.checkoutForm.value.b_postcode;
        this.profile.customer_city = this.checkoutForm.value.b_city;
        this.profile.customer_state = this.checkoutForm.value.b_state;
    }
  }



}
