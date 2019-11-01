import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  // Property
  navbarOpen = false;
  userStatus = this.authService.userStatus;

  ngOnInit() {
    this.authService.userStatusChages.subscribe(x => this.userStatus = x);
    console.log(this.userStatus);
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
  }

}
