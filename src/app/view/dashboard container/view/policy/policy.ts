import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import {
  PolicyService,
  PolicyModel
} from '../../../../services/policy.service';


@Component({
  selector: 'app-policy',
  standalone: true,

  imports: [],

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


  // =====================================================
  // DATA
  // =====================================================

  policies: PolicyModel[] = [];

  allPolicies: PolicyModel[] = [];


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

          this.policies = data;

          this.allPolicies = data;

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