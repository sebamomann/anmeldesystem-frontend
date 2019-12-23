import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-comment',
  templateUrl: './commentDialog.component.html',
  styleUrls: ['./commentDialog.component.scss']
})
export class CommentDialogComponent implements OnInit {

  private enrollment: any;

  event = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.required, Validators.min(2)]),
  });

  constructor(public dialogRef: MatDialogRef<CommentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.enrollment = data.enrollment;
  }

  ngOnInit() {
  }

  comment(): void {
    if (this.event.valid) {
      console.log('name: ' + this.getName().value);
      console.log('comment: ' + this.getComment().value);
    }
  }

  getNameErrorMessage(): string {
    return this.getName().hasError('required')
      ? 'Bitte gebe deinen Namen an.'
      : 'Etwas ist schief gelaufen';
  }

  getCommentErrorMessage(): string {
    return this.getName().hasError('required')
      ? 'Bitte gebe einen Kommentar an'
      : 'Etwas ist schief gelaufen';
  }


  private getName() {
    return this.event.get('name');
  }

  private getComment() {
    return this.event.get('comment');
  }

}
