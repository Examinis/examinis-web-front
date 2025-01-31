import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Option } from '../../../shared/interfaces/option';

@Component({
  selector: 'app-option-select',
  imports: [FormsModule, ButtonModule,],
  templateUrl: './option-select.component.html',
  styleUrl: './option-select.component.css'
})
export class OptionSelectComponent implements OnInit {

  // Emit the updated options list to the parent component
  @Output() optionChangedEvent = new EventEmitter<Option[]>();
  options: Option[] = [];
  selectedCorrectOption: number | null = null;

  ngOnInit(): void {

    this.options = [
      {
        description: '',
        letter: 'A',
        isCorrect: false
      },
      {
        description: '',
        letter: 'B',
        isCorrect: false
      },
      {
        description: '',
        letter: 'C',
        isCorrect: false
      },
      {
        description: '',
        letter: 'D',
        isCorrect: false
      }
    ];

    // Initialize the component with default options
    this.optionChangedEvent.emit(this.options);
  }

  addOption(): void {
    if (this.options.length < 5) {
      this.options.push({
        description: 'Descrição da opção',
        // get the next letter in the alphabet using ASCII code (A, B, C, ...)
        letter: String.fromCharCode(65 + this.options.length),
        isCorrect: false
      });

      this.onOptionChange();
    }
  }
  
  onOptionChange() {
    this.optionChangedEvent.emit(this.options);
  }

  chooseCorrectOption(index: number): void {
    this.selectedCorrectOption = index;
  
    // Define todas as opções como false e apenas a opção escolhida como true
    this.options.forEach((option, i) => {
      option.isCorrect = i === index;
    });
  
    this.onOptionChange();
  }
  

  removeOption(index: number): void {
    // Ensure that there are always at least two options
    if (this.options.length < 2) {
      return;
    }

    this.options.splice(index, 1);  // Remove the option at the given index
    this.onOptionChange();

    // Adjust the correct alternative if it has been removed
    if (index === this.selectedCorrectOption) {
      this.selectedCorrectOption = null;
    } else if (this.selectedCorrectOption !== null && this.selectedCorrectOption > index) {
      this.options[index - 1].isCorrect = true;
      this.selectedCorrectOption--;
    }
  }
}
