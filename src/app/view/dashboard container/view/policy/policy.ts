import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
  ElementRef,
  HostListener
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import {
  PolicyService,
  PolicyModel
} from '../../../../services/policy.service';


@Component({
  selector: 'app-policy',
  standalone: true,

  imports: [FormsModule],

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

  isDateFilterOpen = false;


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

    this.policies = [...this.allPolicies];

    this.isDateFilterOpen = false;

  }


  toggleDateFilter(): void {

    this.isDateFilterOpen = !this.isDateFilterOpen;

    if (this.isDateFilterOpen) {

      this.draftFromDate = this.fromDate;

      this.draftToDate = this.toDate;

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

    this.fromDate = this.draftFromDate;

    this.toDate = this.draftToDate;

    this.filterPolicies();

    this.isDateFilterOpen = false;

  }


  private parseInputDate(value: string): number | undefined {

    const [year, month, day] = value
      .split('-')
      .map(Number);

    return this.toDateKey(year, month, day);

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