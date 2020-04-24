import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {AccountService} from '../../../../services/account.service';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-email-change',
  templateUrl: './email-change.component.html',
  styleUrls: ['./email-change.component.scss']
})
export class EmailChangeComponent implements OnInit {

  public mail: string;
  public token: string;
  public error = null;
  private date: any;

  constructor(private route: ActivatedRoute, private accountService: AccountService,
              private router: Router) {
    this.route.params.subscribe(params => {
      this.mail = params.mail;
      this.token = params.token;
    });
  }

  async ngOnInit() {
    if (this.mail != null && this.token != null) {
      await this.accountService
        .changeEmail(this.mail, this.token)
        .subscribe(
          () => {
            this.router.navigate(['/account/profile'], {
              queryParams: {
                mail: 'success'
              }
            });
          },
          err => {
            let message = '';

            if (err.status === HttpStatus.BAD_REQUEST) {
              switch (err.error.code) {
                case 'INVALID':
                  message = 'Mit diesem Link kann ich leider nichts anfangen. Hast du ihn versehentlich nicht komplett kopiert?';
                  break;
                case 'EXPIRED':
                  message = 'Sorry, der Link ist leider abgelaufen. Jeder Link ist maximal 24 Stunden gültig. ' +
                    'Erstelle dir einfach einen neuen.';
                  break;
                case 'USED':
                  const pipe = new DatePipe('de-DE');
                  this.date = pipe.transform(new Date(err.error.error.date), 'dd.MM.y, HH:mm');
                  message = `Sieht so aus, als hättest du bereits deine Email mit diesem Link am ` +
                    `${(this.date)} Uhr geändert. Erstelle dir einfach einen neuen Link und komm wieder!`;
                  break;
                case 'OUTDATED':
                  message = `Du hast anscheinend bereits einen neuen Link zum ändern angefordert. ` +
                    `Diesen hier kann ich nicht mehr verarbeiten!`;
                  break;
              }

              this.error = message;
            }
          }
        );
    }
  }
}
