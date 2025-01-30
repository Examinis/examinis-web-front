import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { Testimonial } from '../shared/interfaces/testimonial';

@Component({
  selector: 'app-home',
  imports: [ToolbarModule, ButtonModule, CardModule, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  testimonials: Testimonial[] = [
    {
      icon: 'pi pi-star',
      feedback: 'This is a great site!',
      name: 'John Doe'
    },
    {
      icon: 'pi pi-star',
      feedback: 'I love this site!',
      name: 'Jane Doe'
    }
  ];
}
