import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  // Property
  navbarOpen = false;
  userStatus = this.authService.userStatus;

  ngOnInit() {
    this.authService.userChanges();
    this.authService.userStatusChages.subscribe(x => {
      this.userStatus = x;
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
    this.authService.logout();
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

}
