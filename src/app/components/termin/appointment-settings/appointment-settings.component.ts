import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {EnrollmentService} from '../../../services/enrollment.service';
import {Location} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {FormBuilder, FormControl} from '@angular/forms';
import {UrlService} from '../../../services/url.service';
import {IFileModelUpload} from '../../../models/IFileModelUpload.model';

@Component({
  selector: 'app-appointment-settings',
  templateUrl: './appointment-settings.component.html',
  styleUrls: ['./appointment-settings.component.scss']
})
export class AppointmentSettingsComponent implements OnInit {
  private isEdit = true;

  private link: any;
  private appointment: IAppointmentModel;
  private overallDataFormGroup: any;
  private additionFormGroup: any;
  private linkFormGroup: any;
  private administratorFormGroup: any;

  private numberOfShares = 10;

  private administrators: string[] = [
    'benutzer1@sebamomann.de',
    'text@example.de',
    'mama@mia.com',
    'foo@bar.tld',
    'hallo@helmut.rofl'];

  // FILE
  public files: Array<{ name: string; id: string }> = [{name: 'test1.pdf', id: '123'}, {name: 'test2.png', id: '234'}];
  private fileForUpload: Array<{ file: File, done: boolean }> = [];
  private fileList: IFileModelUpload[] = [];
  private fileBlob: Blob;

  constructor(private appointmentService: AppointmentService, public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private authenticationService: AuthenticationService, private enrollmentService: EnrollmentService,
              private snackBar: MatSnackBar, private location: Location, private sanitizer: DomSanitizer,
              private formBuilder: FormBuilder, public urlService: UrlService) {
    this.route.queryParams.subscribe(params => {
      this.link = params.a;
    });

    this.route.params.subscribe(params => {
      if (params.link !== undefined) {
        this.link = params.link;
        this.router.navigate(['/enroll'], {queryParams: {a: this.link}}).then(() => '');
      }
    });

    this.administratorFormGroup = this.formBuilder.group({
      name: new FormControl()
    });
  }

  ngOnInit() {
    this.appointmentService
      .getAppointment(this.link, false)
      .subscribe(sAppointment => {
        this.appointment = sAppointment;

        this.parseDataIntoForms();
      });
  }



  public privateGetOverall(str: string) {
    return this.overallDataFormGroup.get(str);
  }

  private parseDataIntoForms() {
    this.parseLinkData();
  }

  private parseLinkData() {
    this.linkFormGroup.setValue({
      link: this.appointment.link,
      description: this.appointment.description,
    });

    this.checkLink();
  }

  private checkLink() {
    if (this.linkFormGroup.get('link').value !== this.appointment.link) {
      this.linkFormGroup.get('link').setErrors({new: true});
      this.linkFormGroup.get('link').markAsTouched();
    }
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

  saveOverall(data: any) {
  }

  saveAdditions(data: any) {
  }

  saveLink($event: any) {

  }
}
