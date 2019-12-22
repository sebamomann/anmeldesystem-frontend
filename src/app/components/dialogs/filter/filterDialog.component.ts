import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-filter',
  templateUrl: './filterDialog.component.html',
  styleUrls: ['./filterDialog.component.scss']
})
export class FilterDialogComponent implements OnInit {

  driverPassenger: string;

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
