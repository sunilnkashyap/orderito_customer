
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IS_DEMO,StringConstant} from "../app.stringconstant";
import {ApiService} from "../services/api.service";
import {LoaderService} from "../services/loader.service";



@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.page.html',
  styleUrls: ['./passwordreset.page.scss'],
})
export class PasswordresetPage implements OnInit {
  forgotPassForm:FormGroup;
  email = "";

  constructor(
    private fun: FunctionsService, 
    private api: ApiService,
    private loaderService: LoaderService,
    private menuCtrl: MenuController, 
    private formBuilder: FormBuilder,
    private navController: NavController,
    public alertController: AlertController
    ) {
  }

  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({
          user_email: ['', Validators.compose([Validators.required,Validators.pattern(StringConstant.myEMAIL_REGEXP)])],
  
      });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  reset() {
    if (this.fun.validateEmail(this.email)) {
      this.fun.presentToast('Verification mail sent', false, 'bottom', 2100);
    }
    else {
      this.fun.presentToast('Wrong Input!', true, 'bottom', 2100);
    }
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Your password has been reset',
      message: 'You will shortly recive an email with your password',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-round',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
      ]
    });

    await alert.present();
  }

  sendRequest()
  {
      let formData = {
            "email": this.forgotPassForm.value.user_email,
            
        }
        console.log(formData);
        this.api.post("forgot_password.php",formData).subscribe((res: any) => {
            console.log("RESULT", res);
            this.loaderService.showToast(res.response.message);
            if(res.response.success == 1)
            {
                this.navController.navigateRoot(['/tabs/login']);
            }
            
           
        }, err => {
          console.log('errrrr');
           // this.loaderService.hide();
            console.error('ERROR', err);
        });
  }

}
