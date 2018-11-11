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

interface ImageDetail {
  base64: string;
  name: string;
  lastModified: Date;
  localUrl: string;
  nativeUrl: string;
  size: number;
  type: string;
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

  images: ImageDetail[] = [];

  getFileMeta(fileEntry: FileEntry) {
    return new Promise<IFile>((resolve, reject) => {
      fileEntry.file(success => {
        resolve(success);
      });
    });

  }

  async getFileData(fullUrl: string) {

    if (fullUrl.substring(0, 21) == "content://com.android") {
      const photo_split = fullUrl.split("%3A");
      fullUrl = "content://media/external/images/media/" + photo_split[1];
    }
    const resolvedFileSystemUri = await this.file.resolveLocalFilesystemUrl(fullUrl) as FileEntry;

    const split = fullUrl.split('/');

    // const path = split.splice(0, split.length - 1).join('/');

    // const file = split[0];



    const fileMeta = await this.getFileMeta(resolvedFileSystemUri);

    debugger;

    const path = resolvedFileSystemUri.nativeURL.substring(0, resolvedFileSystemUri.nativeURL.lastIndexOf('/'));

    const fileName = resolvedFileSystemUri.name;

    const base64 = await this.file.readAsDataURL(path, fileName);

    debugger;

    const imageDetail: ImageDetail = {
      base64: base64,
      lastModified: new Date(fileMeta.lastModifiedDate),
      localUrl: fileMeta.localURL,
      nativeUrl: resolvedFileSystemUri.nativeURL,
      name: fileMeta.name,
      size: fileMeta.size,
      type: fileMeta.type
    };

    this.images.unshift(imageDetail);

  }

  takePicture() {

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      this.getFileData(imageData);


    }, (err) => {
    });
  }

}
