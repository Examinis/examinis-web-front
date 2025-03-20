import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Router } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit { 
  showSidebar: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showSidebar = this.router.url === '/' || this.router.url === '/register' || this.router.url === '/#funcionalidades' || this.router.url === '/#depoimentos' || this.router.url === '/#beneficios' || this.router.url === '/#contato'|| this.router.url.startsWith('/login');
    });
  }
}
