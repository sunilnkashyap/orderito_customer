
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController, Platform, Events} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { InfomodalPage } from '../infomodal/infomodal.page';
// import { DataService } from '../data.service';
import {ApiService} from "../services/api.service";
import {LoaderService} from "../services/loader.service";
import {IS_DEMO,StringConstant} from "../app.stringconstant";
import {Storage} from "@ionic/storage";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoggedIn = false;
  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  loginForm:FormGroup;
  showPassword = false;
  passwordToggleIcon = 'eye';
  re:any;
  // email = '';
  // password = '';

  constructor(
    private platform: Platform,
    private api: ApiService,
    private loaderService : LoaderService,
    public storage: Storage,
    public formBuilder: FormBuilder,
    private splashScreen: SplashScreen,
    private fun: FunctionsService,
    private menuCtrl: MenuController,
    private event:Events,
    private fb: Facebook,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController)
    {
      this.re = this.activatedRoute.snapshot.paramMap.get('re');
      console.log(this.re);
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
          login_email: ['', Validators.pattern(StringConstant.myEMAIL_REGEXP)],
          login_password: ['', Validators.required],
      });
    /*this.storage.get('USER_ID').then((val) => {
      
      // this.storage.clear();
      console.log('User Id', val);
      if(val !== null){
        this.fun.navigate('/tabs/profile', true);
      }
      
    });*/
    
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    // console.log("kgkhj");
    this.storage.get('USER_ID').then((val) => {
      // this.storage.clear();
      console.log('User Id', val);
      if(val !== null){

        this.fun.navigate('/tabs/profile', true);
      }
      
    });
    // console.log(this.location);
    // console.log(this.location.back());

  }

  togglePassword() :void {
    this.showPassword = !this.showPassword;
    if(this.passwordToggleIcon == 'eye'){
      this.passwordToggleIcon = 'eye-off';
    }
    else{
      this.passwordToggleIcon = 'eye';
    }
  }

/*  signin() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        if (this.fun.validateEmail(this.email) && this.password !== '') {
          this.fun.navigate('/tabs/profile', false);
        } else {
          this.fun.presentToast('Wrong Input!', true, 'bottom', 2100);
        }
      } else {
        this.fun.navigate('/tabs/profile', false);
      }
    });

  }*/

  doLogin(){
    let formData = {
      "email": this.loginForm.value.login_email,
      "password" : this.loginForm.value.login_password
    }
    // console.log(formData);
    this.loaderService.show("Please wait...");
    this.api.post("user_login.php", formData).subscribe((res: any)=>{
      this.loaderService.hideAll();
      console.log("RESULT", res);
      let myData = res.response;
      if(myData.success == 1){
        this.storage.set('USER_ID', myData.userData.customer_id);
        this.storage.set('USER_NAME', myData.userData.customer_name);
        this.storage.set('USER_IMAGE', myData.userData.image);
        this.storage.set('USER_EMAIL', myData.userData.customer_email);
        this.loaderService.showToast(myData.message);
        setTimeout(()=>{ 
                  this.event.publish('USERLOGIN', {
                    type: 'login'
                  }); 
        }, 1500);
        this.event.publish('APP_NAME', {
          type:"order_status"
        })
        setTimeout(()=>{ 
                if(this.re == 'cart'){
                  this.fun.navigate('/tabs/cart', false);   
                }
                else if(this.re == 'orders'){
                  this.fun.navigate('/tabs/orders', false); 
                }
                else{
                  this.fun.navigate('/tabs/profile', false); 
                }
                
                // this.location.back();
        }, 1600);
        
      }else{
        this.loaderService.showToast(myData.message);
      }
    },err => {
      this.loaderService.hideAll();
      console.error('ERROR', err);
    }
    )
  }



  fbLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email']).then(res => {
        if (res.status === 'connected') {
        this.isLoggedIn = true;
        this.getFBUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
   }



   getFBUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => {
        console.log(res);
        this.users = res;

        /* Save User Details */
      let formData = {
        "customer_name": this.users.name,
        "customer_lastname": this.users.name,
        "customer_phone": "",
        "customer_crossstreet": "",
        "customer_zip": "",
        "customer_city": "",
        "customer_state": "",
        "customer_password": "",
        "customer_email": this.users.email,
        "fb_id": this.users.id,
        "image": this.users.picture.data.url
      }
      console.log(formData);

          this.loaderService.show("Please wait...");
          this.api.post("fb_login.php", formData).subscribe((res: any) => {
          console.log("RESULT", res);

          this.storage.set('USER_ID', res.response.customer_id);
          this.storage.set('USER_NAME', this.users.name);
          this.storage.set('USER_IMAGE', this.users.picture.data.url);
          this.storage.set('USER_EMAIL', this.users.email);
          this.storage.set('USER_REFERRAL_CODE', res.response.refer_code);
          this.event.publish('APP_NAME', {
            type:"order_status"
          })

        this.loaderService.hideAll();

      }, err => {
        console.log('errrrr');
        this.loaderService.hide();
          console.error('ERROR', err);
      });
              /* Save User Details */

      })
      .catch(e => {
        console.log(e);
      });
  }





  async open_modal(b) {

    let modal;
    if (b) {
      modal = await this.modalController.create({
        component: InfomodalPage,
        //componentProps: { value: this.data.terms_of_use, title: 'Terms of Use' }
        // Terms of Use database id  = 4;
        componentProps: { content_id: "4"}
      });
    } else {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { content_id: "2"}
      });
    }
    return await modal.present();
  }


  goToSignup(){
    this.fun.navigate('/tabs/signup', false);
  }

}
