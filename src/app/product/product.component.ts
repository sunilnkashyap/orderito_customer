
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product, DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import { IonSlides, AlertController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  inputs: ['product', 'slider']
})

export class ProductComponent implements OnInit {

  @Input() product: Product;
  @Input() slider: IonSlides;
  @Output() notify: EventEmitter<Number> = new EventEmitter<Number>();

  slideOpts = {
    effect: 'flip'
  };
  open = [false, false, false, false];
  liked = false;
  private currentNumber = 1;
  constructor(public alertController: AlertController,
    private socialSharing: SocialSharing,
    private fun: FunctionsService, private dataService: DataService) { }
    private increment () {
      this.currentNumber++;
    }
    
     private decrement () { 
       if (this.currentNumber > 0) 
         { this.currentNumber--; }
          }
  ngOnInit() {
  }
  
  goToReviews() {
    this.notify.emit(2);
  }

  toogle(i) {
    this.open[i] = !this.open[i];
  }

  remove() {
    this.slider.lockSwipes(true);
  }

  gainback() {
    this.slider.lockSwipes(false);
  }

  like() {
    console.log('like')
    this.liked = !this.liked;
  }

  shareViaInstagram(img) {
    // Check if sharing via email is supported
    this.socialSharing.canShareVia('instagram').then(() => {
      // Sharing via email is possible
      this.socialSharing.shareViaInstagram('Hey ! Look at the new dress I just bought from Shoppr app. Find more such apps at ', 'www/' + img).then(() => {
        // Success!
      }).catch(() => {
        // Error!
        this.createAlert('Error sharing product via Instagram. Please check if you have Instagram app on the device')
      });
    }).catch(() => {
      // Sharing via email is not possible
      this.createAlert('Could not find Instagram app on the device. Please install Instagram and try again.')
    });
  }

  
  async createAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Sorry',
      subHeader: 'App not found',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  shareCommon(img) {
    console.log(img);
    this.socialSharing.share('Hey ! Look at the new dress I just bought from Shoppr app. Find more such apps at ', 'Enappd store - Shoppr app', 'www/' + img, 'enappd.com').then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
}
