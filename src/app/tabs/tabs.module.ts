import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'mainhome', loadChildren: '../mainhome/mainhome.module#MainhomePageModule' },
      { path: 'home/:storeID', loadChildren: '../home/home.module#HomePageModule' },
      // { path: 'login', loadChildren: '../login/login.module#LoginPageModule' },
      { path: 'login/:re', loadChildren: '../login/login.module#LoginPageModule' },
      { path: 'signup', loadChildren: '../signup/signup.module#SignupPageModule' },
      { path: 'passwordreset', loadChildren: '../passwordreset/passwordreset.module#PasswordresetPageModule' },
      { path: 'list', loadChildren: '../list/list.module#ListPageModule' },
      { path: 'infomodal', loadChildren: '../infomodal/infomodal.module#InfomodalPageModule' },
      { path: 'cart', loadChildren: '../cart/cart.module#CartPageModule' },
      { path: 'productdetail/:itemID', loadChildren: '../productdetail/productdetail.module#ProductdetailPageModule' },
      { path: 'productlist', loadChildren: '../productlist/productlist.module#ProductlistPageModule' },
      { path: 'search/:cat_name', loadChildren: '../search/search.module#SearchPageModule' },
      { path: 'notification', loadChildren: '../notification/notification.module#NotificationPageModule' },
      { path: 'NewAddress/:id', loadChildren: '../new-address/new-address.module#NewAddressPageModule' },
      { path: 'Checkout', loadChildren: '../checkout/checkout.module#CheckoutPageModule' },
      { path: 'wishcash', loadChildren: '../wishcash/wishcash.module#WishcashPageModule' },
      { path: 'applypromo', loadChildren: '../applypromo/applypromo.module#ApplypromoPageModule' },
      { path: 'orders', loadChildren: '../orders/orders.module#OrdersPageModule' },
      { path: 'orderinfo', loadChildren: '../orderinfo/orderinfo.module#OrderinfoPageModule' },
      { path: 'faqs', loadChildren: '../faqs/faqs.module#FaqsPageModule' },
      { path: 'faq', loadChildren: '../faq/faq.module#FaqPageModule' },
      { path: 'support', loadChildren: '../support/support.module#SupportPageModule' },
      { path: 'rewards', loadChildren: '../rewards/rewards.module#RewardsPageModule' },
      { path: 'settings', loadChildren: '../settings/settings.module#SettingsPageModule' },
      { path: 'notificationssettings', loadChildren: '../notificationssettings/notificationssettings.module#NotificationssettingsPageModule' },
      { path: 'emailsettings', loadChildren: '../emailsettings/emailsettings.module#EmailsettingsPageModule' },
      { path: 'addressbook', loadChildren: '../addressbook/addressbook.module#AddressbookPageModule' },
      { path: 'managepayments', loadChildren: '../managepayments/managepayments.module#ManagepaymentsPageModule' },
      { path: 'newpayment', loadChildren: '../newpayment/newpayment.module#NewpaymentPageModule' },
      { path: 'datacontrol', loadChildren: '../datacontrol/datacontrol.module#DatacontrolPageModule' },
      { path: 'currencysettings', loadChildren: '../currencysettings/currencysettings.module#CurrencysettingsPageModule' },
      { path: 'accountsettings', loadChildren: '../accountsettings/accountsettings.module#AccountsettingsPageModule' },
      { path: 'country', loadChildren: '../country/country.module#CountryPageModule' },
      { path: 'changeemail', loadChildren: '../changeemail/changeemail.module#ChangeemailPageModule' },
      { path: 'changepassword', loadChildren: '../changepassword/changepassword.module#ChangepasswordPageModule' },
      { path: 'storeview', loadChildren: '../storeview/storeview.module#StoreviewPageModule' },
      { path: 'storeview/:cat_name', loadChildren: '../storeview/storeview.module#StoreviewPageModule' },
      { path: 'profile', loadChildren: '../profile/profile.module#ProfilePageModule' },
      { path: 'location', loadChildren: '../location/location.module#LocationPageModule' },
      { path: 'editprofile/:userID', loadChildren: '../editprofile/editprofile.module#EditprofilePageModule' },

    ]
  },
  {
    path: '',
    redirectTo: '/tabs/mainhome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
