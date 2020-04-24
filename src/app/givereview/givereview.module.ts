import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GivereviewPage } from './givereview.page';
import { StarRatingModule } from 'ionic4-star-rating';

const routes: Routes = [
  {
    path: '',
    component: GivereviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StarRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GivereviewPage]
})
export class GivereviewPageModule {}
