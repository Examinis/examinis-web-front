import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ToolbarModule } from 'primeng/toolbar';
@Component({
  selector: 'app-home',
  imports: [ToolbarModule, ButtonModule, CardModule, CarouselModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router: Router;
  showMenu = false;

  testimonials = [
    {
      nome: "Fulano de Tal",
      cargo: "Professor",
      texto: "Plataforma incrível! Facilitou muito a criação das minhas provas.",
      icon: 'pi pi-user',
    },
    {
      nome: "Ciclana Silva",
      cargo: "Coordenadora Pedagógica",
      texto: "Recomendo a todos! Muito prática e segura.",
      icon: 'pi pi-user',
    },

  ];

  constructor(router: Router) {
    this.router = router;
  }

  toListPage = () => {
    this.router.navigate(['/questions']);
  }
}