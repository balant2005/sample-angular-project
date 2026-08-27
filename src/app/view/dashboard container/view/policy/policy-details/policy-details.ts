import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  PolicyService,
  PolicyModel
} from '../../../../../services/policy.service';


@Component({
  selector: 'app-policy-details',
  standalone: true,

  imports: [],

  templateUrl: './policy-details.html',
  styleUrl: './policy-details.css'
})
export class PolicyDetailsComponent implements OnInit {

  // =====================================================
  // SERVICES
  // =====================================================

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private policyService = inject(PolicyService);

  private cdr = inject(ChangeDetectorRef);


  // =====================================================
  // DATA
  // =====================================================

  policy: PolicyModel | null = null;

  loading = true;

  errorMessage = '';


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Policy Details page loaded'
    );


    const id =
      this.route.snapshot.paramMap.get('id');


    console.log(
      'Policy ID from URL:',
      id
    );


    if (!id) {

      this.loading = false;

      this.errorMessage =
        'Policy ID not found';

      return;

    }


    this.loadPolicy(id);

  }


  // =====================================================
  // LOAD POLICY
  // =====================================================

  loadPolicy(id: string): void {

    this.loading = true;

    this.errorMessage = '';


    console.log(
      'Loading policy:',
      id
    );


    this.policyService
      .getPolicyById(id)
      .subscribe({

        next: (data: PolicyModel) => {

          console.log(
            'Policy details received:',
            data
          );


          this.policy = data;

          this.loading = false;


          this.cdr.detectChanges();

        },


        error: (error: unknown) => {

          console.error(
            'Error loading policy:',
            error
          );


          this.loading = false;

          this.policy = null;

          this.errorMessage =
            'Unable to load policy details';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // EDIT POLICY
  // =====================================================

  editPolicy(): void {

    if (!this.policy?.id) {

      console.error(
        'Policy ID not found'
      );

      return;

    }


    console.log(
      'Editing policy:',
      this.policy.id
    );


    this.router.navigate([
      '/policy',
      this.policy.id,
      'edit'
    ]);

  }


  // =====================================================
  // BACK
  // =====================================================

  goBack(): void {

    this.router.navigate([
      '/policy'
    ]);

  }

}