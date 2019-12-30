import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {CommentService} from '../../../services/comment.service';
import {ICommentModel} from '../../../models/ICommentModel.model';
import {IEnrollmentModel} from '../../../models/IEnrollment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './commentDialog.component.html',
  styleUrls: ['./commentDialog.component.scss']
})
export class CommentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CommentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private commentService: CommentService,
              private snackBar: MatSnackBar) {
    this.enrollment = data.enrollment;
  }

  public enrollment: any;

  event = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    comment: new FormControl('', [Validators.required, Validators.min(2)]),
  });

  // Workaround for angular component issue #13870
  disableAnimation = true;

  ngOnInit() {
    setTimeout(() => this.disableAnimation = false);
  }

  comment(enrollment: IEnrollmentModel): void {
    if (this.event.valid) {
      const comment: ICommentModel = {
        name: this.getName().value,
        comment: this.getComment().value
      };

      this.commentService.comment(comment, enrollment).subscribe(response => {
        this.enrollment.comments.push(response);
        this.snackBar.open('Kommentar gesendet', null, {
          duration: 2000,
          panelClass: 'snackbar-default'
        });
      });
    }
  }

  getNameErrorMessage(): string {
    return this.getName().hasError('required')
      ? 'Bitte gebe deinen namen an.'
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
