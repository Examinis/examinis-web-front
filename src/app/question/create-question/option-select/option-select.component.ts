import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Option } from '../../../shared/interfaces/option';

@Component({
  selector: 'app-option-select',
  imports: [FormsModule, ButtonModule,],
  templateUrl: './option-select.component.html',
  styleUrl: './option-select.component.css'
})
export class OptionSelectComponent {

  @Output() selectedOptionEvent = new EventEmitter<Option>();
  options: Option[] = [
    {
      id: undefined,
      description: '',
      letter: 'A',
      isCorrect: false
    },
    {
      id: undefined,
      description: '',
      letter: 'B',
      isCorrect: false
    },
    {
      id: undefined,
      description: '',
      letter: 'C',
      isCorrect: false
    },
    {
      id: undefined,
      description: '',
      letter: 'D',
      isCorrect: false
    }
  ];
  selectedCorrectOption: number | null = null;

  addOption(): void {
    if (this.options.length < 5) {
      this.options.push({
        id: undefined,
        description: 'Descrição da opção',
        // get the next letter in the alphabet using ASCII code (A, B, C, ...)
        letter: String.fromCharCode(65 + this.options.length),
        isCorrect: false
      });
    }
  }

  chooseCorrectOption(index: number): void {
    this.selectedCorrectOption = index;
    this.options[index].isCorrect = true;
    this.selectedOptionEvent.emit(this.options[index]);
  }

  removeOption(index: number): void {
    // Ensure that there are always at least two options
    if (this.options.length < 2) {
      return;
    }

    this.options.splice(index, 1);

    // Adjust the correct alternative if it has been removed
    if (index === this.selectedCorrectOption) {
      this.selectedCorrectOption = null;
    } else if (this.selectedCorrectOption !== null && this.selectedCorrectOption > index) {
      this.selectedCorrectOption--;
    }
  }
}
