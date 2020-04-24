import { Injectable } from '@angular/core';
import {LoadingController, ToastController} from "@ionic/angular";
import {from} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

    isShown:boolean = false;
    loaderObj:any;
    constructor(public loader:LoadingController, public toastCtrl:ToastController) {

    }
    async show(message:string){
        this.loaderObj = await this.loader.create({
            message:message
        });

        this.isShown = true;
        return await this.loaderObj.present();
    }
    hide(){
         setTimeout(() => {
            if (this.isShown){
                this.loaderObj.dismiss();
            }
        }, 1000);
    }
    hideAll(){
        //this.loaderObj.dismissAll();
        setTimeout(()=>{ 
                    return from(this.loader.dismiss());
               }, 1000);
       
    }
    async showToast(message){
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        return await toast.present();
    }
}
