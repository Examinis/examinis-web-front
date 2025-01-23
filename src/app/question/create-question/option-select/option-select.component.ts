import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-option-select',
  imports: [FormsModule, ButtonModule,],
  templateUrl: './option-select.component.html',
  styleUrl: './option-select.component.css'
})
export class OptionSelectComponent {
  alternatives = [
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' }
  ];
  selectedCorrectAlternative: number | null = null;

  addAlternative(): void {
    this.alternatives.push({ text: '' });
  }

  removeAlternative(index: number): void {
    // Ensure that there are always at least two alternatives
    if (this.alternatives.length < 2) {
      return;
    }

    // index is 1-based, so we need to subtract 1 to get the correct index
    this.alternatives.splice(index - 1, 1);

    // Adjust the correct alternative if it has been removed
    if (this.selectedCorrectAlternative === index) {
      this.selectedCorrectAlternative = null;
    } else if (this.selectedCorrectAlternative !== null && this.selectedCorrectAlternative > index) {
      this.selectedCorrectAlternative--;
    }
  }
}
