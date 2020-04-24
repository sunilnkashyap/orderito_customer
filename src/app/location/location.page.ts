import { Events, ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, Input, NgZone } from '@angular/core';
import {ApiService} from "../services/api.service";
import {API_RESPONSE, APP_NAME} from "../app.stringconstant";
import {LoaderService} from "../services/loader.service";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
	addressvalue:any;
	autocompleteItems;
	autocomplete;
	latitude: number = 0;
	longitude: number = 0;
	geo: any;
	searchLocation: any = '';
	public buttonClicked: boolean = true;
	service = new google.maps.places.AutocompleteService();
  constructor(
  		public viewCtrl: ModalController,
  		private api: ApiService,
		private loaderService: LoaderService,
		private zone: NgZone,
		public storage: Storage,
		private event:Events,
		public navCtrl: NavController) {
  	this.autocompleteItems = [];
		this.autocomplete = {
		  query: ''
	};
  }
  dismiss() {
    this.viewCtrl.dismiss();
    }
  ngOnInit() {
  }
  updateSearch() {
  	if(this.searchLocation != ""){
  		console.log(this.searchLocation);
    this.buttonClicked = true;
   

    let me = this;
    this.service.getPlacePredictions({
    input: this.searchLocation,
    componentRestrictions: {
      country: 'IQ'
    }
   }, (predictions, status) => {
     me.autocompleteItems = [];

   me.zone.run(() => {
     if (predictions != null) {
        predictions.forEach((prediction) => {
          me.autocompleteItems.push(prediction.description);
        });
       }
     });
    });
    console.log(this.autocompleteItems);
  	}
  	
  }
  chooseItem(item: any) {
    this.buttonClicked = !this.buttonClicked; 
    this.searchLocation=item;
    this.storage.set("searchLocation", this.searchLocation);
 	  this.geoCode(item); 
 	  
  }
  geoCode(address:any) {
	    let geocoder = new google.maps.Geocoder();
	    geocoder.geocode({ 'address': address }, (results, status) => {
	    this.latitude = results[0].geometry.location.lat();
	    this.longitude = results[0].geometry.location.lng();
	    console.log("Latitude", this.latitude);
	    console.log("Longitude", this.longitude);
	    // this.storage.set("userLat", this.latitude);
     //  this.storage.set("userLong", this.longitude);
      
      // setTimeout(()=>{
          this.viewCtrl.dismiss();
          this.event.publish('LOCATIONSEARCH', {
            type: 'locationsearch',
            searchLocation: this.searchLocation,
            Latitude : this.latitude,
            longitude : this.longitude
          });
        
      // }, 500);
      
	 });
 	}

}
