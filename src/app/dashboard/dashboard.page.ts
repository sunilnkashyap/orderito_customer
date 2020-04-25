import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  style = {
    width: 0,
    height: 0
  };

  constructor(platform: Platform) {
    platform.ready().then((readySource) => {
      this.style.width = platform.width();
      this.style.height = platform.width();

      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
    });
  }

  ngOnInit() {
  }

}
