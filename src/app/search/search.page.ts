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
import { FunctionsService } from '../functions.service';
// import { DataService } from '../data.service';
import { HomePage } from '../home/home.page';
import { NavController, MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import {Storage} from "@ionic/storage";
import {LoaderService} from "../services/loader.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  // trending = [];
  // recent = [];
  cat_name : string;
  isItemAvailable :boolean = false;
  items: any = [];
  storeList:any = [];
  lat:number;
  long: number;
  item:any = [];
  itemsCopy:any = [];
  it: string;

  constructor(private menuCtrl: MenuController, 
    private fun: FunctionsService, 
    private activatedRoute: ActivatedRoute,
    public storage: Storage,
    private loaderService: LoaderService,
    private nav: NavController) {
    // this.trending = dataService.trending;
    // this.recent = dataService.recent;
    this.cat_name = this.activatedRoute.snapshot.paramMap.get('cat_name');
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.storage.get('userLat').then((userLat) => { 
      this.lat = userLat 
    });
    this.storage.get('userLong').then((userLong) => { 
      this.long = userLong 
    });
    // setTimeout(()=>{
    //   this.fetchStore();
    // },500)
    this.showallstore();
    

    

  }

  showallstore(){
    this.loaderService.show("Please wait...");
    this.storage.get('FOUNDSTORE').then((foundStore) => { 
      this.loaderService.hideAll();
      this.items = foundStore;
      this.itemsCopy = foundStore;
      console.log("foundStore", foundStore);
      // object = Object.assign({}, this.items);
      // console.log(object);
    });
  }

  // fetchStore(){
  //   let formData = {
  //     "cate_name": this.cat_name,
  //     "lat" : this.lat,
  //     "long" : this.long,
  //     "search_keyword" : ""
  //   }
  //   console.log(formData);
  // }





  getItems(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
         this.isItemAvailable = true;
         /*this.items = this.items.map(x => Object.assign({}, x));
         console.log(this.items);
         this.item = this.items.filter((item) =>{
          console.log(item);
            item.restaurant_name = item.restaurant_name.filter((it)=>{
              console.log(it);
            })
         })*/
         /*let newItems = [];
         this.items.forEach((item)=>{
            console.log(item.restaurant_name.indexOf(val));
            if(item.restaurant_name.indexOf(val) > -1){
              newItems.push(item);
            }
         })
         this.items = newItems;*/
         // this.items = this.items.filter((item) => {
         // return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })
     this.items = this.itemsCopy.filter((item)=>{
        console.log(item);
         return item.restaurant_name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    }else{
      this.isItemAvailable = false;
      this.items = this.itemsCopy;
    }
 }

  async presentLoading(id:any, isOpen:any) {
    console.log(id);
    console.log(isOpen);
    if(isOpen == 0){
      this.loaderService.showToast("Store is Closed");
    }
    else{
      // this.fun.navigate('/tabs/search/'+this.cat_name, false);
      this.fun.navigate('/tabs/home/'+id, false);
    }
  }

}
