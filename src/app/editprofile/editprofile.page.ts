import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController, AlertController} from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';
import {Storage} from "@ionic/storage";
import {ApiService} from "../services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IS_DEMO,StringConstant} from "../app.stringconstant";
import {LoaderService} from "../services/loader.service";
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  userID: string;
  profileData:any;
  profile:any = [];
  signupForm:FormGroup;
  first_name = '';
  last_name = '';
  phone = '';
  address ='';
  postcode='';
  city='';
  state='';
  email = '';
  password = '';
  confrmpass='';
  constructor(
    private fun:FunctionsService, 
    private menuCtrl: MenuController, 
    private modalController: ModalController, 
    public storage: Storage,
    private api: ApiService,
    private data: DataService,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute
    ) { 
    // this.storage.get('USER_ID').then((val) => {
    //   console.log('User Id', val);
    //   this.userID = val;
    //   setTimeout(()=>{
    //     this.getCustomerProfile();
    //   }, 1500)
    // });
    this.userID = this.activatedRoute.snapshot.paramMap.get('userID');
  }

  ngOnInit() {
    console.log(StringConstant);
    this.signupForm = this.formBuilder.group({
        f_name: ['', Validators.required],
        l_name: ['', Validators.required],
        phone_no: ['', Validators.required],
        address: ['', Validators.required],
        postcode: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        email: ['', Validators.pattern(StringConstant.myEMAIL_REGEXP)],
        password: [''],
        confirm_pass: [''],
      },{validator: EditprofilePage.passwordsMatch});
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
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    setTimeout(()=>{
        this.getCustomerProfile();
      }, 500)
  }

  getCustomerProfile(){
      if(this.userID == null){
        // console.log("hfjhgjf");
        // this.createAlert('Please Login first to edit your profile');
        this.fun.navigate('/tabs/login/login', false);
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
      
  
    // if(this.userID !== null){
      
      // console.log(this.userID);
      
    // }
    
  }

  doSignup(){
    console.log(this.signupForm.value);
    let formData = {
      "userid" : this.userID,
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
    this.loaderService.show("Please wait...");
        this.api.post("update_user_profile.php",formData).subscribe((res: any) => {
            console.log("RESULT", res);
            this.loaderService.hideAll();
            if(res.response.success==1)
            {
                this.loaderService.showToast(res.response.message);
                this.fun.navigate('/tabs/profile',false);
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

  signup(){
    if(this.first_name != '' && this.last_name != '' && this.email != '' && this.password != '' && this.fun.validateEmail(this.email)){
      this.fun.navigate('/storeview',false);
    }
    else {
      this.fun.presentToast('Wrong Input', true, 'bottom', 2100);
    }
  }

  async open_modal(b){
    let modal;
    if(b){
      modal = await this.modalController.create({
        component: InfomodalPage,
        // componentProps: { value: this.data.terms_of_use, title: 'Terms of Use' }
        componentProps: { content_id: "4"}
      });
    }
    else{
      modal = await this.modalController.create({
        component: InfomodalPage,
        // componentProps: { value: this.data.privacy_policy, title: 'Privacy Policy' }
        componentProps: { content_id: "2"}
      });
    }
    return await modal.present();
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
            // this.fun.navigate('/tabs/login', false);
            this.fun.navigate('/tabs/login/login', false);
          }
        }]
    });

    await alert.present();
  }


}
