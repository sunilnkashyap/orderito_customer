
import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController} from '@ionic/angular';
import {ApiService} from "../services/api.service";
import {LoaderService} from "../services/loader.service";
import { FunctionsService } from '../functions.service';
import { OrderinfoPage } from '../orderinfo/orderinfo.page';
import { GivereviewPage } from '../givereview/givereview.page';
import {Storage} from "@ionic/storage";
import { IS_DEMO, StringConstant } from "../app.stringconstant";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  responseData:any = [];
  userid:any;
  orderid:any;
  resid:any;
  currencySign: string;

  constructor(
    private menuCtrl: MenuController, 
    private modalController: ModalController, 
    private alertController: AlertController,
    private api: ApiService,
    private loaderService: LoaderService,
    private fun: FunctionsService, 
    public storage: Storage
  ){
      // this.orders = dataService.orders;

  }

  ngOnInit() {
    this.currencySign = StringConstant.currencySign;
    
    // this.getRecentOrder();
  }
  getRecentOrder(val){
    
    let formData = {
       "userid": val
           
    }
    console.log(formData);
    this.loaderService.show("Please wait...");
    this.api.post("recent_orders.php",formData).subscribe((res: any) =>{
      console.log("RESULT", res);
      // this.orders = res;
      this.loaderService.hideAll();  
      let myData = res.response;
      console.log(myData);
      if(myData.success == 1)
      {
        if (myData.userData.orderList) 
        {
          this.responseData = myData.userData.orderList;        
        }
                 
                  
      }
      else
      {
        this.loaderService.hideAll();
        alert('no');
        //this.loaderService.showToast(this.translate.instant(res.message));
      }
    }, err => {
            this.loaderService.hideAll();
            console.error('ERROR', err);
    })
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(false, 'start');
    this.storage.get('USER_ID').then((val) => {
        console.log('User Id', val);
        this.userid=val;
        //alert(this.userid);
        // if(this.userid !='' || this.userid !== null)
        // {
        //   this.getRecentOrder(val);
        // }
        // else{
        //   console.log('jgjhg');
        // }
        if(this.userid === null){
          // console.log('jgjth');
          // this.fun.navigate('/tabs/login', false);
          this.createAlert('Please Login to see your order history');
          // this.fun.navigate('/tabs/login/orders', false);
        }
        else{
          this.getRecentOrder(val);
        }
      
    });
  }

  async openorderdetails(order) {
    // console.log(orderID);
    // this.orderid = orderID;
    // let formData = {
    //   "orderid": this.orderid
           
    // }
    let modal = await this.modalController.create({
      component: OrderinfoPage,
      componentProps: { value: order}
    });
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
            this.fun.navigate('/tabs/login/orders', false);
          }
        }]
    });

    await alert.present();
  }


  async giveReview(orderid:any, resid:any) {
    // console.log(orderID);
    // this.orderid = orderID;
    // let formData = {
    //   "orderid": this.orderid
           
    // }
    this.orderid = orderid;
    this.resid = resid;
    let modal = await this.modalController.create({
      component: GivereviewPage,
      componentProps: {orderid: this.orderid, resid: this.resid}
    });
    return await modal.present();
  }

}
