/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../services/api.service";
import {LoaderService} from "../services/loader.service";
// import { Orders } from '../data.service';
import { FunctionsService } from '../functions.service';
import { IS_DEMO, StringConstant } from "../app.stringconstant";

@Component({
  selector: 'app-orderinfo',
  templateUrl: './orderinfo.page.html',
  styleUrls: ['./orderinfo.page.scss'],
})
export class OrderinfoPage implements OnInit {

  currencySign: string;
  orderid:any;
  taxes: any = [];
  orderShort: any = [];
  ordergenerateid: string;
  restaurant_id: string;
  orderLong:any = [];
  restaurant: any = [];
  driver: any = [];

  constructor(private modalController: ModalController, private activatedRoute:ActivatedRoute,
    private api: ApiService, private loaderService: LoaderService, private params: NavParams, private fun: FunctionsService) {
    this.orderid = params.get('value');

  }

  ngOnInit() {
    console.log(this.orderid);
    this.currencySign = StringConstant.currencySign;
    // this.orderid = params.get('orderid');
    // this.orderid = '219';
    // this.orderid = this.activatedRoute.snapshot.paramMap.get('value');
    this.getAllOrderDetailss();
  }

  getAllOrderDetailss(){ 
       // this.is_data_loaded = false;
       // this.loaderService.show(this.translate.instant("Please wait") + "...");
        this.loaderService.show("Please wait...");
        this.api.post("order_details.php", {orderid:this.orderid}).subscribe((resp:any)=>{
          //alert('ok');
          this.loaderService.hideAll();
          let myData = resp.response
            console.log(myData);
            this.taxes = myData.userData.taxes;
            this.orderShort = myData.userData.order;
            this.ordergenerateid = myData.userData.order.ordergenerateid;
            this.restaurant_id = myData.userData.order.restaurant_id;
            this.orderLong = myData.userData.orderDetails;
            this.restaurant = myData.userData.restaurantDetails;
            this.driver = myData.userData.driverDetails;
            
        },(err) => {
          this.loaderService.hideAll();
          console.log("ERROR", err);
          //alert('not ok');
            //this.loaderService.hide();
            //this.loaderService.showToast(this.translate.instant(API_RESPONSE.PROBLEM_IN_API));
        });
    }

  dismiss(){
    this.modalController.dismiss();
  }

}
