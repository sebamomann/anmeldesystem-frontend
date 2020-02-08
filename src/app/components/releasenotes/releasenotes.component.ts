import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IReleasenote} from '../../models/IReleasenote.model';
import {ReleasenotesService} from '../../services/releasenotes.service';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-releasenotes',
  templateUrl: './releasenotes.component.html',
  styleUrls: ['./releasenotes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReleasenotesComponent implements OnInit {
  private releasenotes: IReleasenote[];
  private releasenotesFrontend: IReleasenote[];
  private releasenotesBackend: IReleasenote[];

  constructor(private releasenotesService: ReleasenotesService) {
  }

  ngOnInit() {
    this.releasenotesService.getAll()
      .subscribe(res => {
        if (res.type === HttpEventType.Response) {
          this.releasenotes = res.body;
          this.releasenotesFrontend = this.releasenotes.filter(fReleasenote => {
            if (fReleasenote.project === 1) {
              return fReleasenote;
            }
          });
          this.releasenotesBackend = this.releasenotes.filter(fReleasenote => {
            if (fReleasenote.project === 2) {
              return fReleasenote;
            }
          });
        }
      });
  }
}
