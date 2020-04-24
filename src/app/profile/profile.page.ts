import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import {IS_DEMO,StringConstant} from "../app.stringconstant";
import {ApiService} from "../services/api.service";
import {Storage} from "@ionic/storage";
import {LoaderService} from "../services/loader.service";
import { Events, MenuController, IonSlides, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'; 
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userName: string;
  userEmail: string;
  userPhone: string;
  userAddress: string;
  userImage: string;
  UserPhoto:any;
  public base64Image :string;// "assets/imgs/logo-main.png";
  imageURI:any;
  imageFileName:any;
  UserId: any;
  userRewardPoints: any;
  constructor(
    private menuCtrl: MenuController,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private api: ApiService,
    public storage: Storage,
    public actionSheetController: ActionSheetController,
    private loaderService: LoaderService,
    private event:Events,
    private fun: FunctionsService
    ) { }

  ngOnInit() {
    
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.initializeApp();
  }
  initializeApp(){ 
       
      //this.getUserDetails();
      this.userImage = "../../../assets/images/person-flat.png";
      this.storage.get('USER_ID').then((val) => {
        console.log('User Id', val);
        if(val!='')
        {
          this.UserId = val;
          this.getUserDetails(val);
        }
    });
  }

  async selectImage() { 
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
      {
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType:number) {
    console.log("Uploading path ",StringConstant.API_URL+'/upload_user_image');
    const options : CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }
    //console.log(this.camera.DestinationType.DATA_URL);
    this.camera.getPicture(options) .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.imageURI = this.base64Image;//imageData;
        console.log(this.imageURI );
        /*this.prod_details.push(this.base64Image);
        this.prod_details.reverse();*/
        this.uploadFile(this.imageURI,this.base64Image);
    }, (err) => {
        console.log(err);
    });
  }

  uploadFile(filename,fileDetails) {
    // console.log(filename);
    // console.log(fileDetails);
    // console.log("Uploading path ",StringConstant.API_URL+'/upload_user_image');
    //this.loaderService.show(this.translate.instant('Uploading')+"...");
    const fileTransfer: FileTransferObject = this.transfer.create();

        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: 'user_profile_image.jpeg',
            chunkedMode: false,
            mimeType: "jpeg",
            params:{
                "userid":this.UserId,
                "securitykey": "138ynmb-2378qnHH72yh(JDC2678UK52NB!48a"
            },
            headers: {}
        };
       this.loaderService.show("Please wait...");
        // fileTransfer.upload(this.imageURI, StringConstant.API_URL+'/update_U_profile.php', options)
        fileTransfer.upload(this.imageURI, StringConstant.API_URL+'/upload_user_image.php', options)
            .then((data:any) => {
              console.log(data);
              this.loaderService.hideAll();
              this.getUserDetails(this.UserId);
                console.log("After upload data",JSON.stringify(data));
                 let responseData = JSON.parse(data.response);
                 console.log('Response Data ---', responseData);
                 this.userImage = responseData.imagePath;
                 console.log("this Image Url", this.userImage);
            }, (err) => {
            this.loaderService.hideAll(); 
                //console.log(JSON.stringify(err));
                //this.loaderService.hide();
                //this.loaderCtrl.showToast(err);
                console.log("An error has occurred: Code = " + err.code);
                console.log("upload error source " + err.source);
                console.log("upload error target " + err.target);
                console.log("upload error http_status " + err.http_status);
                console.log("upload error body " + err.body);
                console.log("upload error exception " + err.exception);
            });
    }


  getUserDetails(val)
  {
    let formData = {"userid": val}
      // console.log(formData);
      this.loaderService.show("Please  wait...");
      this.api.post("user_profile.php",formData).subscribe((res: any) => {
        console.log("RESULT", res);
        this.loaderService.hideAll();
        let myData = res.response;
        // console.log(JSON.stringify(myData));
        if(myData.success == 1){
          this.userName = [myData.userData.customer_name, myData.userData.customer_lastname].join(" ");
          this.userEmail = myData.userData.customer_email;
          this.userPhone = myData.userData.customer_phone;
          this.userAddress = myData.userData.customer_crossstreet;
          if(myData.userData.image!=""){
            this.userImage = myData.userData.image;
          }
          
          this.storage.set('USER_DETAILS', myData); 
          setTimeout(()=>{ 
            this.event.publish('USERLOGIN', {
              type: 'login'
            }); 
          }, 1500);   
        }
        else{
          this.loaderService.hideAll();
          alert('no');
          //this.loaderService.showToast(this.translate.instant(res.message));
        }
      },err =>{
        this.loaderService.hideAll();
        console.error('ERROR', err);
      });
  }

  logout()
  {
    this.storage.remove('USER_ID');
    this.loaderService.showToast("Logout successfully.");
    // console.log("oohjgfh");
     // this.event.publish('APP_NAME', {
     //    type:"order_status"
     //  });
    setTimeout(()=>{ 
        this.event.publish('USERLOGOUT', {
          type: 'logout'
        }); 
    }, 1500);
    setTimeout(()=>{ 
       this.fun.navigate('/tabs/login/login', true);
    }, 1000);
     
     
     //this.logoutalert();
   
  } 

  goEditPgae(){
    this.storage.get('USER_ID').then((val) => {
      this.UserId = val;
      console.log(this.UserId);
      this.fun.navigate('/tabs/editprofile/'+this.UserId, true);
    })
  }

}
