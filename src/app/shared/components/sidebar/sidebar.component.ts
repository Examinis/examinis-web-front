import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule, RouterModule,
    AvatarModule, PanelMenu],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {}


  ngOnInit() {
    this.items = [
      {
        label: 'Questões',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Listar',
            icon: 'pi pi-list'
          },
          {
            label: 'Criar',
            icon: 'pi pi-pencil'
          }
        ]
      },
      {
        label: 'Provas',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Listar',
            icon: 'pi pi-list'
          },
          {
            label: 'Criar manual',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Criar automático',
            icon: 'pi pi-cog'
          }
        ]
      }
    ]
  }

  goTo(route: string) {
    // Aqui você pode chamar o roteamento do Angular
    console.log(`Navegando para: ${route}`);
  }
}
