import { ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'datepicker-actions',
  templateUrl: './template.html',
  styleUrls: ['./style.css'],
  standalone: true,
  imports: [
      MatIconModule
  ],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class DatepickerActions implements OnInit, OnDestroy {
    public currentDateTime: string;
    private timerId: any;
    constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef) {}
    ngOnInit() {
      this.updateDateTime();
      this.timerId = setInterval(() => {
        this.updateDateTime();
      }, 1000); // Update every second
    }
    private updateDateTime() {
      this.currentDateTime = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.cdr.detectChanges();
    }
    ngOnDestroy() {
      if (this.timerId) {
        clearInterval(this.timerId); // Clear the interval on component destruction
      }
    }
    
}
