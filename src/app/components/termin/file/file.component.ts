import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {IFileModelUpload} from '../../../models/IFileModelUpload.model';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @Output()
  save = new EventEmitter<any>();
  public files: Array<{ name: string; id: string }> = [{name: 'test1.pdf', id: '123'}, {name: 'test2.png', id: '234'}];
  public fileList: IFileModelUpload[] = [];
  @Input()
  private appointment: IAppointmentModel;
  @Input()
  private button = 'Speichern';
  private fileForUpload: Array<{ file: File, done: boolean }> = [];
  private fileBlob: Blob;

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  selectFilesFromComputer() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.fileForUpload.push({file, done: false});
      }
      this.convertFiles();
    };

    fileUpload.click();
  }

  async blobToBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  private convertFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.fileForUpload.forEach(file => {
      this.convertFile(file).catch(() => {
        this.snackBar.open('Datei konnte nicht hochgeladen werden', null, {
          duration: 2000,
          panelClass: 'snackbar-error'
        });
      });
    });
  }

  private async convertFile(file) {
    this.fileBlob = new Blob([file.file], {type: 'application/octet-stream'});
    const result = await this.blobToBase64(this.fileBlob).catch(e => e);
    if (result instanceof Error) {
      return;
    }
    this.fileList.push({name: file.file.name, data: result.toString()});
  }
}
