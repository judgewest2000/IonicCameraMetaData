import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { File, FileEntry, IFile } from '@ionic-native/file';
import { createText } from '@angular/core/src/view/text';
import { ResourceLoader } from '@angular/compiler';


/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface CameraDetail {
  filename: string;
  json_metadata: string;
}

interface CameraExifDetail {
  aperture: string;
  datetime: string;
  exposureTime: string;
  flash: string;
  focalLength: string;
  gpsAltitude: string;
  gpsAltitudeRef: string;
  gpsDateStamp: string;
  gpsLatitude: string;
  gpsLatitudeRef: string;
  gpsLongitude: string;
  gpsLongitudeRef: string;
  gpsProcessingMethod: string;
  gpsTimestamp: string;
  iso: string;
  make: string;
  model: string;
  orientation: string;
  whiteBalance: string;
}

interface Output {
  base64: string;
  exifDetail: CameraExifDetail;
}

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  images: Output[] = [];


  takePicture() {

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData: string) => {

      const cameraDetail = <CameraDetail>JSON.parse(imageData);

      const exifData = <CameraExifDetail>JSON.parse(cameraDetail.json_metadata);

      const output: Output = {
        base64: `data:image/jpeg;base64,${cameraDetail.filename}`,
        exifDetail: exifData
      };

      this.images.unshift(output);

    }, (err) => {
    });
  }

}
