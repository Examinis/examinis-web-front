import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-option-select',
  imports: [FormsModule, ButtonModule,],
  templateUrl: './option-select.component.html',
  styleUrl: './option-select.component.css'
})
export class OptionSelectComponent {

  @Output() selectedOptionEvent = new EventEmitter<Object>();

  options = [
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' }
  ];
  selectedCorrectOption: number | null = null;

  addOption(): void {
    if (this.options.length < 5) {
      this.options.push({ text: '' });
    }
  }

  chooseCorrectOption(index: number): void {
    this.selectedOptionEvent.emit(this.options[index]);
  }

  removeOption(index: number): void {
    // Ensure that there are always at least two options
    if (this.options.length < 2) {
      return;
    }

    this.options.splice(index, 1);

    // Adjust the correct alternative if it has been removed
    if (this.selectedCorrectOption === index) {
      this.selectedCorrectOption = null;
    } else if (this.selectedCorrectOption !== null && this.selectedCorrectOption > index) {
      this.selectedCorrectOption--;
    }
  }
}
