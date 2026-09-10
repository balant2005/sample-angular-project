import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
  ElementRef,
  HostListener
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';

import {
  PolicyService,
  PolicyModel
} from '../../../../services/policy.service';


interface CalendarDay {

  date: Date;

  day: number;

  isCurrentMonth: boolean;

}


@Component({
  selector: 'app-policy',
  standalone: true,

  imports: [
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule
  ],

  templateUrl: './policy.html',
  styleUrl: './policy.css'
})
export class Policy implements OnInit {

  // =====================================================
  // SERVICES
  // =====================================================

  private policyService = inject(PolicyService);

  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  private elementRef = inject(ElementRef);


  // =====================================================
  // DATA
  // =====================================================

  policies: PolicyModel[] = [];

  allPolicies: PolicyModel[] = [];

  fromDate = '';

  toDate = '';

  draftFromDate = '';

  draftToDate = '';

  draftFromDateValue: Date | null = null;

  draftToDateValue: Date | null = null;

  isDateFilterOpen = false;

  calendarMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  activePreset = 'Custom Range';


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadPolicies();

  }


  // =====================================================
  // LOAD POLICIES
  // =====================================================

  loadPolicies(): void {

    console.log('Loading policies...');

    this.policyService
      .getPolicies()
      .subscribe({

        next: (data: PolicyModel[]) => {

          console.log(
            'Policies loaded:',
            data
          );

          this.allPolicies = [...data];

          this.filterPolicies();

          this.cdr.detectChanges();

        },

        error: (error: unknown) => {

          console.error(
            'Error loading policies:',
            error
          );

          this.policies = [];

          this.allPolicies = [];

          this.cdr.detectChanges();

        }

      });

  }


  filterPolicies(): void {

    const from = this.fromDate
      ? this.parseInputDate(this.fromDate)
      : undefined;

    const to = this.toDate
      ? this.parseInputDate(this.toDate)
      : undefined;

    if (!from && !to) {

      this.policies = [...this.allPolicies];

      return;

    }

    if (from && to && from > to) {

      this.policies = [];

      return;

    }

    this.policies = this.allPolicies.filter(
      (policy: PolicyModel) => {

        const createdDate = this.parsePolicyDate(
          policy.createdDate
        );

        if (!createdDate) {

          return false;

        }

        return (
          (!from || createdDate >= from) &&
          (!to || createdDate <= to)
        );

      }
    );

  }


  clearDateFilter(): void {

    this.fromDate = '';

    this.toDate = '';

    this.draftFromDate = '';

    this.draftToDate = '';

    this.draftFromDateValue = null;

    this.draftToDateValue = null;

    this.policies = [...this.allPolicies];

    this.isDateFilterOpen = false;

  }


  toggleDateFilter(): void {

    this.isDateFilterOpen = !this.isDateFilterOpen;

    if (this.isDateFilterOpen) {

      this.draftFromDate = this.fromDate;

      this.draftToDate = this.toDate;

      this.draftFromDateValue = this.fromDate
        ? this.dateFromInput(this.fromDate)
        : null;

      this.draftToDateValue = this.toDate
        ? this.dateFromInput(this.toDate)
        : null;

      const selectedDate = this.draftFromDateValue || new Date();

      this.calendarMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );

      this.activePreset = 'Custom Range';

    }

  }


  @HostListener('document:click', ['$event'])
  closeDateFilter(event: Event): void {

    const clickedElement = event.target as Node;

    const filterArea =
      this.elementRef.nativeElement.querySelector('.filter-area');

    if (
      this.isDateFilterOpen &&
      filterArea &&
      !filterArea.contains(clickedElement)
    ) {

      this.isDateFilterOpen = false;

    }

  }


  applyDateFilter(): void {

    this.fromDate = this.draftFromDateValue
      ? this.formatDateForFilter(this.draftFromDateValue)
      : '';

    this.toDate = this.draftToDateValue
      ? this.formatDateForFilter(this.draftToDateValue)
      : '';

    this.draftFromDate = this.fromDate;

    this.draftToDate = this.toDate;

    this.filterPolicies();

    this.isDateFilterOpen = false;

  }


  cancelDateFilter(): void {

    this.isDateFilterOpen = false;

  }


  previousCalendarMonth(): void {

    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() - 1,
      1
    );

  }


  nextCalendarMonth(): void {

    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + 1,
      1
    );

  }


  getCalendarDays(monthOffset: number): CalendarDay[] {

    const monthStart = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + monthOffset,
      1
    );

    const firstDay = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      1 - monthStart.getDay()
    );

    return Array.from({ length: 42 }, (_, index) => {

      const date = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate() + index
      );

      return {
        date,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === monthStart.getMonth()
      };

    });

  }


  selectCalendarDate(date: Date): void {

    const selectedDate = this.copyDate(date);

    this.activePreset = 'Custom Range';

    if (
      !this.draftFromDateValue ||
      this.draftToDateValue ||
      selectedDate < this.draftFromDateValue
    ) {

      this.draftFromDateValue = selectedDate;

      this.draftToDateValue = null;

      return;

    }

    this.draftToDateValue = selectedDate;

  }


  selectPreset(label: string, months: number): void {

    const endDate = new Date();

    const startDate = new Date();

    startDate.setMonth(
      startDate.getMonth() - months
    );

    this.draftFromDateValue = this.copyDate(startDate);

    this.draftToDateValue = this.copyDate(endDate);

    this.activePreset = label;

    this.calendarMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );

  }


  selectDurationPreset(
    label: string,
    durationMilliseconds: number
  ): void {

    const endDate = new Date();

    const startDate = new Date(
      endDate.getTime() - durationMilliseconds
    );

    this.draftFromDateValue = startDate;

    this.draftToDateValue = endDate;

    this.activePreset = label;

    this.calendarMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );

  }


  isSelectedDate(date: Date): boolean {

    return this.isSameDate(date, this.draftFromDateValue) ||
      this.isSameDate(date, this.draftToDateValue);

  }


  isDateInRange(date: Date): boolean {

    return !!this.draftFromDateValue &&
      !!this.draftToDateValue &&
      date > this.draftFromDateValue &&
      date < this.draftToDateValue;

  }


  isToday(date: Date): boolean {

    return this.isSameDate(date, new Date());

  }


  getDateRangeLabel(): string {

    if (!this.draftFromDateValue) {

      return 'Select date range';

    }

    const from = this.formatDisplayDate(this.draftFromDateValue);
    const to = this.draftToDateValue
      ? this.formatDisplayDate(this.draftToDateValue)
      : 'Select end date';

    return `${from} - ${to}`;

  }


  getMonthLabel(monthOffset: number): string {

    const date = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + monthOffset,
      1
    );

    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });

  }


  private copyDate(date: Date): Date {

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  }


  private isSameDate(
    firstDate: Date,
    secondDate: Date | null
  ): boolean {

    return !!secondDate &&
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate();

  }


  private formatDisplayDate(date: Date): string {

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

  }


  private parseInputDate(value: string): number | undefined {

    const [year, month, day] = value
      .split('-')
      .map(Number);

    return this.toDateKey(year, month, day);

  }


  private dateFromInput(value: string): Date | null {

    const [year, month, day] = value
      .split('-')
      .map(Number);

    const date = new Date(year, month - 1, day);

    return Number.isNaN(date.getTime())
      ? null
      : date;

  }


  private formatDateForFilter(date: Date): string {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  private parsePolicyDate(
    value: string | undefined
  ): number | undefined {

    if (!value) {

      return undefined;

    }

    const dateParts = value.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (dateParts) {

      return this.toDateKey(
        Number(dateParts[3]),
        Number(dateParts[2]),
        Number(dateParts[1])
      );

    }

    const isoParts = value.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})/
    );

    if (isoParts) {

      return this.toDateKey(
        Number(isoParts[1]),
        Number(isoParts[2]),
        Number(isoParts[3])
      );

    }

    return undefined;

  }


  private toDateKey(
    year: number,
    month: number,
    day: number
  ): number | undefined {

    const date = new Date(
      year,
      month - 1,
      day
    );

    if (
      !Number.isFinite(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {

      return undefined;

    }

    return Date.UTC(year, month - 1, day);

  }


  // =====================================================
  // CREATE POLICY
  // =====================================================

  createPolicy(): void {

    this.router.navigate([
      '/policy/create'
    ]);

  }


  // =====================================================
  // OPEN POLICY DETAILS
  // =====================================================

  openPolicy(
    policy: PolicyModel
  ): void {

    console.log(
      'Clicked policy:',
      policy
    );


    if (!policy.id) {

      console.error(
        'Policy ID not found'
      );

      return;

    }


    console.log(
      'Opening policy ID:',
      policy.id
    );


    this.router.navigate([
      '/policy',
      policy.id
    ]);

  }


  // =====================================================
  // DELETE POLICY
  // =====================================================

  deletePolicy(
    id: string | undefined,
    event?: Event
  ): void {

    // Prevent row click
    // when Delete button is clicked

    event?.stopPropagation();


    if (!id) {

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this policy?'
      );


    if (!confirmed) {

      return;

    }


    this.policyService
      .deletePolicy(id)
      .subscribe({

        next: () => {

          console.log(
            'Policy deleted successfully'
          );

          this.loadPolicies();

        },

        error: (error: unknown) => {

          console.error(
            'Error deleting policy:',
            error
          );

        }

      });

  }

}