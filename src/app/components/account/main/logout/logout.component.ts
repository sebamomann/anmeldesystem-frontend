import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }
}
