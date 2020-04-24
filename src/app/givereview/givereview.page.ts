import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoaderService} from "../services/loader.service";
import {Storage} from "@ionic/storage";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-givereview',
  templateUrl: './givereview.page.html',
  styleUrls: ['./givereview.page.scss'],
})
export class GivereviewPage implements OnInit {
	reviewForm:FormGroup;
	rate:number;
	rateText:string = "Not Rated";
	userid:any;
  	orderid:any;
  	resId:any;
  	comment:any;

  	constructor(private modalController: ModalController, private api: ApiService, private loaderService: LoaderService, public storage: Storage, public formBuilder: FormBuilder,private params: NavParams) {
  		this.orderid = params.get('orderid');
  		this.resId = params.get('resid');
  	 }

  	ngOnInit() {
  		this.reviewForm = this.formBuilder.group({
          starRating: ['', Validators.required],
          comment: ['', Validators.required]
      	});
  		this.storage.get('USER_ID').then((val) => {
  			this.userid = val;
  		})
  		console.log("ngOnInit");
  		setTimeout(()=>{
  			this.fetchReview();
  		},500)
  		
  	}

  	logRatingChange(rating){
        console.log("changed rating: ",rating);
        if(rating == 1){
        	this.rateText ="One Star";
        }
        if(rating == 2){
        	this.rateText ="Two Stars";
        }
        if(rating == 3){
        	this.rateText ="Three Stars";
        }
        if(rating == 4){
        	this.rateText ="Four Stars";
        }
        if(rating == 5){
        	this.rateText ="Five Stars";
        }

        
        // do your stuff
    }
    clearrate(){
    	this.rate = 0;
    	this.rateText ="Not Rated";
    }

  	dismiss(){
    	this.modalController.dismiss();
  	}
  	doreview(){
	    let formData = {
			"star_rating_review": this.reviewForm.value.starRating,
			"text_review"       : this.reviewForm.value.comment,
			"order_id"          : this.orderid,
			"restaurant_id"     : this.resId,
			"customer_id"       : this.userid

	    }
	    this.loaderService.show("Please wait...");
    	this.api.post("add_review_restaurant.php",formData).subscribe((res: any) =>{
    		console.log(res);
    		let myData = res.response;
    		this.loaderService.hideAll();
    		this.loaderService.showToast(myData.message);
    		// if(myData.success == 1){
    			this.dismiss();
    		// }
    		// setTimeout(()=>{ 
                
      //   	}, 1600);

    	})
	    console.log(formData);
	}
	fetchReview(){
		let formData = {
			"order_id"          : this.orderid,
			"restaurant_id"     : this.resId,
			"customer_id"       : this.userid

	    }
	    console.log(formData);
	    this.api.post("restaurant_review.php",formData).subscribe((resp: any) =>{
	    	console.log("restaurant_review",resp);
	    	let myData = resp.response;
	    	this.rate = myData.rate;
	    	this.logRatingChange(this.rate);
	    	// console.log(this.rate);
	    	this.comment = myData.message;


	    })
	}

}
