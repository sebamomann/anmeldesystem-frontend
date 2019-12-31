import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ICommentModel} from '../models/ICommentModel.model';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) {
  }

  comment(comment: ICommentModel, enrollment: IEnrollmentModel) {
    return this.httpClient.post<ICommentModel>(`${environment.api.url}comment?id=${enrollment.id}`, comment);
  }
}
