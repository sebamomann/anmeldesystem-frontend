import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-filter',
  templateUrl: './filterDialog.component.html',
  styleUrls: ['./filterDialog.component.scss']
})
export class FilterDialogComponent implements OnInit {

  private dialogFilter: any;
  private isFilterActive: boolean;

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.dialogFilter = JSON.parse(JSON.stringify(data.filter));
    this.checkForActiveFilters();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkForActiveFilters() {
    this.isFilterActive = this.dialogFilter.additions.filter(val => val.active).length > 0;
  }
}
