
import { Component, OnInit, Input, NgZone} from '@angular/core';
import { FunctionsService } from '../functions.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MenuController, ModalController, NavController} from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import {LoaderService} from "../services/loader.service";
import { HttpClient } from '@angular/common/http';
// import { DataService } from '../data.service';
import {IS_DEMO,StringConstant} from "../app.stringconstant";
import {ApiService} from "../services/api.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm:FormGroup;
  validZip : boolean = false;
  cityState:any = [];
  profile:any = [];
  // service = new google.maps.places.AutocompleteService();
  constructor(
    private fun:FunctionsService, 
    private menuCtrl: MenuController, 
    private modalController: ModalController, 
    private navController: NavController,
    private loaderService: LoaderService,
    public formBuilder: FormBuilder,
    public api : ApiService,
    private zone: NgZone,
    public http: HttpClient
    ) { 

  }

  ngOnInit() {
    console.log(StringConstant);
    this.signupForm = this.formBuilder.group({
        f_name: ['', Validators.required],
        l_name: ['', Validators.required],
        phone_no: ['', Validators.compose([Validators.required,Validators.pattern(StringConstant.myNUMBER_REGEXP)])],
        address: ['', Validators.required],
        postcode: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        email: ['', Validators.compose([Validators.required,Validators.pattern(StringConstant.myEMAIL_REGEXP)])],
        password: ['', Validators.required],
        confirm_pass: ['', Validators.required] ,
      },{validator: SignupPage.passwordsMatch});
  }
  static passwordsMatch(cg: FormGroup): {[err: string]: any} {
    let password = cg.get('password');
    let confirm_pass = cg.get('confirm_pass');
    let rv: {[error: string]: any} = {};
    if ((password.touched || confirm_pass.touched) && password.value !== confirm_pass.value) {
      rv['passwordMismatch'] = true;
    }
    return rv;
  }


  getCity()
  {
    //console.log(this.signupForm.value.postcode);
    let zip = this.signupForm.value.postcode;
    //let zip = "r3c";
    console.log(zip);
    //alert('hi');
    this.http.get('https://zip.getziptastic.com/v2/IQ/'+zip).subscribe(data=>{
    console.log(data); 
      this.validZip = false;
      this.cityState= data;
      //this.cityState.state = data.state;
    }, err => {
          console.log('errrrr');
    // console.log(data.city);
      this.validZip = true;
      this.cityState= "";
      //this.cityState.state = "";
    })
      
  }

  doSignup(){
    let formData = {
      "customer_name": this.signupForm.value.f_name,
      "customer_lastname": this.signupForm.value.l_name,
      "customer_phone": this.signupForm.value.phone_no,
      "customer_crossstreet": this.signupForm.value.address+', '+this.signupForm.value.city+', '+this.signupForm.value.state+', '+this.signupForm.value.postcode,
      "customer_zip": this.signupForm.value.postcode,
      "customer_city": this.signupForm.value.city,
      "customer_state": this.signupForm.value.state,
      "customer_password": this.signupForm.value.password,
      "customer_email": this.signupForm.value.email,
    };
    console.log(formData);
    console.log("from submited",formData);
        this.loaderService.show("Please wait...");
        this.api.post("user_sign_up.php",formData).subscribe((res: any) => {
            console.log("RESULT", res);
            this.loaderService.hideAll();
            if(res.response.success==1)
            {
                this.loaderService.showToast(res.response.message);
                // this.fun.navigate('home',false);
                // this.fun.navigate('/tabs/login',false);
                // this.fun.navigate('/tabs/login/login', true);
                this.pagelo();
                setTimeout(()=>{
                  this.navController.navigateRoot(['/tabs/login/login']);
                }, 1000);
                // 
            }
            else
            {
                this.loaderService.showToast(res.response.message);
            }

        }, err => {
            console.log('errrrr');
            this.loaderService.hide();
            console.error('ERROR', err);
        });
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    console.log("Entering signup page ...........................");
    // this.fun.navigate('/tabs/signup', false);
    setTimeout(() => {
      // this.pagelo();
                    
    }, 3000); 
    
  }

  ionViewDidLeave(){
    console.log("leaving signup page ...........................");
    // this.pagelo();
  }

  pagelo(){
    console.log("page load");
    this.profile.customer_name = '';
    this.profile.customer_lastname = '';
    this.profile.customer_phone = '';
    this.profile.customer_crossstreet = '';
    this.profile.customer_zip = '';
    this.profile.customer_city = '';
    this.profile.customer_state = '';
    this.profile.customer_email = '';
    this.profile.customer_password = '';
    this.profile.customer_conpassword = '';  
    // this.navController.navigateRoot(['/tabs/signup']);
  }

  /*signup(){
    if(this.first_name != '' && this.last_name != '' && this.email != '' && this.password != '' && this.fun.validateEmail(this.email)){
      this.fun.navigate('home',false);
    }
    else {
      this.fun.presentToast('Wrong Input', true, 'bottom', 2100);
    }
  }*/

  async open_modal(b){
    let modal;
    if(b){
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { content_id: "4"}
      });
    }
    else{
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: {content_id: "2"}
      });
    }
    return await modal.present();
  }

}
