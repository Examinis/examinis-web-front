import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    AvatarModule, PanelMenu],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Questões',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Criar',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Listar',
            icon: 'pi pi-list'
          }
        ]
      },
      {
        label: 'Provas',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Criar manualmente',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Criar automaticamente',
            icon: 'pi pi-cog'
          },
          {
            label: 'Listar',
            icon: 'pi pi-list'
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
