import { Component, ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-drawer',
  imports: [DrawerModule, ButtonModule, Ripple, AvatarModule, StyleClass],
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
