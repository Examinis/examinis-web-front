import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateStringToDate'
})
export class DateStringToDatePipe implements PipeTransform {
  transform(value: string): Date | null {
    if (!value) return null;
    const parts = value.split(/[\s/:]+/);
    return new Date(+parts[2], +parts[1] - 1, +parts[0], +parts[3] || 0, +parts[4] || 0, +parts[5] || 0);
  }
}
