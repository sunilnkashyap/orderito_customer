import { Component, OnInit,Input, NgZone } from '@angular/core';
import { NavParams,ModalController } from '@ionic/angular';
import { google } from 'google-maps';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.page.html',
  styleUrls: ['./autocomplete.page.scss'],
})
export class AutocompletePage {
  autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;
  geo: any

  service = new google.maps.places.AutocompleteService();

  constructor ( private zone: NgZone, public modalController: ModalController) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async chooseItem(item: any) {
  	//alert(item);
  	const onClosedData: string = item;
  	//alert(onClosedData);
    await this.modalController.dismiss(onClosedData);
  	//alert('ok');
     //this.modalCtrl.dismiss();
    this.geo = item;
    //this.geoCode(this.geo);//convert Address to lat and long
  }

  updateSearch() {

    if (this.autocomplete.query == '') {
     this.autocompleteItems = [];
     return;
    }

    let me = this;
    this.service.getPlacePredictions({
    input: this.autocomplete.query,
    componentRestrictions: {
      country: 'ca'
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
  }

  //convert Address string to lat and long
  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.latitude = results[0].geometry.location.lat();
    this.longitude = results[0].geometry.location.lng();
    alert("lat: " + this.latitude + ", long: " + this.longitude);
   });
 }
}


