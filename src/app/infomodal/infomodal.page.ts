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
import {ApiService} from "../services/api.service";
import {LoaderService} from "../services/loader.service";

@Component({
  selector: 'app-infomodal',
  templateUrl: './infomodal.page.html',
  styleUrls: ['./infomodal.page.scss'],
})
export class InfomodalPage implements OnInit {

  // title : string;
  content_id : string;

  content:any = [];

  constructor(private modalController: ModalController, private api: ApiService, private loaderService: LoaderService, private params: NavParams) {
    // this.title = params.get('title');
    this.content_id = params.get('content_id');
  }

  ngOnInit() {
    console.log(this.content_id);
    // console.log(this.title);
    this.loaderService.show("Please wait...");
    if(this.content_id == "4"){
      this.api.post("terms_of_use.php", {id:this.content_id}).subscribe((resp:any)=>{
        this.loaderService.hideAll();
        console.log("RESULT", resp);
        this.content = resp.response.content;
      })
    }
    if(this.content_id == "2"){
      this.api.post("privacy_policy.php", {id:this.content_id}).subscribe((resp:any)=>{
        this.loaderService.hideAll();
        console.log("RESULT", resp);
        this.content = resp.response.content;
      })
    }
    
    
  }

  dismiss() {
    this.modalController.dismiss();

  }

}
