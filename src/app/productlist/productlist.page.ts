/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../data.service';
import { FunctionsService } from '../functions.service';
import { NavController } from '@ionic/angular';
import { API_RESPONSE, APP_NAME, StringConstant } from "../app.stringconstant";

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.page.html',
  styleUrls: ['./productlist.page.scss'],
  inputs: ['recieved_data']
})
export class ProductlistPage implements OnInit {
  currencySign: string;
  @Input() recieved_data: Array<Product>;

  constructor(private fun: FunctionsService, private nav: NavController) {
  }

  ngOnInit() {
    this.currencySign = StringConstant.currencySign;
  }

  open(data) {
    console.log(data);
    // this.fun.update(data);
    this.nav.navigateForward('/tabs/productdetail/'+data);
  }

}
