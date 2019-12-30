import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ICommentModel} from '../models/ICommentModel.model';
import {IEnrollmentModel} from '../models/IEnrollment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) {
  }

  comment(comment: ICommentModel, enrollment: IEnrollmentModel) {
    console.log(enrollment.id);
    return this.httpClient.post<ICommentModel>(`http://localhost:3000/comment?id=${enrollment.id}`, comment);
  }
}
