import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StoreviewPage } from './storeview.page';
import { TooltipsModule } from 'ionic-tooltips';
import { StarRatingModule } from 'ionic4-star-rating';


const routes: Routes = [
  {
    path: '',
    component: StoreviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarRatingModule,
    RouterModule.forChild(routes),
    TooltipsModule.forRoot(),
   
  ],
  declarations: [StoreviewPage]
})
export class StoreviewPageModule {}
