import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
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
  @Input() options: Option[] = [];
  selectedCorrectOption: number | null = null;

  ngOnInit(): void {

    if (this.options.length === 0) {
      this.options = [
        {
          description: '',
          letter: 'A',
          isCorrect: true
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
        },
        {
          description: '',
          letter: 'E',
          isCorrect: false
        }
      ];
    }

    this.optionChangedEvent.emit(this.options);
    this.chooseCorrectOption(0);
  }

  addOption(): void {
    if (this.options.length < 5) {
      this.options.push({
        description: '',
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
  
    this.options.forEach((option, i) => {
      option.isCorrect = i === index;
    });
  
    this.onOptionChange();
  }
  

  removeOption(index: number): void {
    if (this.options.length < 2) {
      return;
    }

    this.options.splice(index, 1);
    this.onOptionChange();

    if (index === this.selectedCorrectOption) {
      this.selectedCorrectOption = null;
    } else if (this.selectedCorrectOption !== null && this.selectedCorrectOption > index) {
      this.options[index - 1].isCorrect = true;
      this.selectedCorrectOption--;
    }
  }
}
