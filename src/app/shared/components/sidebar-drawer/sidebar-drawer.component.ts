import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-sidebar-drawer',
  imports: [DrawerModule, ButtonModule, Ripple, AvatarModule],
  templateUrl: './sidebar-drawer.component.html',
  styleUrl: './sidebar-drawer.component.css'
})
export class SidebarDrawerComponent {
  router: Router;
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;

  goTo(page: string): void {
    this.router.navigate(['/' + page]);
  }

  constructor(router: Router) {
    this.router = router;
  }
}
