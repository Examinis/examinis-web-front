import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-option-select',
  imports: [FormsModule],
  templateUrl: './option-select.component.html',
  styleUrl: './option-select.component.css'
})
export class OptionSelectComponent {
  alternatives = [
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' },
    { id: 4, text: '' }
  ];
  selectedCorrectAlternative: number | null = null;

  addAlternative(): void {
    this.alternatives.push({ id: this.alternatives.at(-1)!.id, text: '' });
  }

  removeAlternative(index: number): void {
    if (this.alternatives.length > 2) {
      this.alternatives.splice(index, 1);
      // Adjust the correct alternative if it has been removed
      if (this.selectedCorrectAlternative === index) {
        this.selectedCorrectAlternative = null;
      } else if (this.selectedCorrectAlternative !== null && this.selectedCorrectAlternative > index) {
        this.selectedCorrectAlternative--;
      }
    }
  }
}
