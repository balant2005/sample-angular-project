import {
  Component,
  ChangeDetectorRef,
  OnInit,
  signal
} from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,       
  ReactiveFormsModule,
  Validators
} from '@angular/forms';                                                                                                                     

import { 
  CdkDragDrop,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';  

import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import {
  PolicyService,
  PolicyModel
} from '../../../../../services/policy.service';

@Component({
  selector: 'app-create',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule
  ],

  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class CreateComponent implements OnInit {

  // =========================================================
  // EDIT MODE
  // =========================================================

  isEditMode = false;

  editingPolicyId: string | null = null;

  // Existing policy sequence
  policySequence: number | undefined = undefined;

  // =========================================================
  // FORM
  // =========================================================

  policyForm: FormGroup;

  // =========================================================
  // UI STATE
  // =========================================================

  saveSuccess = signal(false);

  saving = false;

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

    this.policyForm = this.fb.group({

      policyName: [
        '',
        Validators.required
      ],

      sourceName: [
        '',
        Validators.required
      ],

      variableName: [
        '',
        Validators.required
      ],

      actions: this.fb.array([])

    });



    this.addAction();
  }

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    console.log(
      'EDIT ID:',
      id
    );

    this.isEditMode = true;

    this.editingPolicyId = id;

    this.loadPolicyForEdit(id);
  }

  // =========================================================
  // LOAD POLICY FOR EDIT
  // =========================================================

  loadPolicyForEdit(
    id: string
  ): void {

    this.policyService
      .getPolicyById(id)
      .subscribe({

        next: (policy: PolicyModel) => {

          console.log(
            'POLICY RECEIVED:',
            policy
          );

          // =================================================
          // POLICY SEQUENCE
          // =================================================

          const existingSequence =
            Number(policy.sequence);

          if (
            Number.isFinite(existingSequence) &&
            existingSequence > 0
          ) {

            this.policySequence =
              existingSequence;

          }

          // =================================================
          // BASIC DETAILS
          // =================================================

          this.policyForm.patchValue({

            policyName:
              policy.policyName ?? '',

            sourceName:
              policy.sourceName ?? '',

            variableName:
              policy.variableName ?? ''

          });

          // =================================================
          // DB ACTIONS
          // =================================================

          let dbActions: any =
            (policy as any).actions;

          console.log(
            'DB ACTIONS:',
            dbActions
          );

          if (
            typeof dbActions === 'string'
          ) {

            try {

              dbActions =
                JSON.parse(dbActions);

            } catch {

              dbActions = [];

            }

          }

          if (
            !Array.isArray(dbActions)
          ) {

            dbActions = [];

          }

          // =================================================
          // IMPORTANT
          // SORT ACTIONS BY SEQUENCE
          // =================================================

          dbActions = [...dbActions].sort(
            (a: any, b: any) => {

              const seqA = Number(a?.sequence);
              const seqB = Number(b?.sequence);

              const finalA =
                Number.isFinite(seqA) && seqA > 0
                  ? seqA
                  : Number.MAX_SAFE_INTEGER;

              const finalB =
                Number.isFinite(seqB) && seqB > 0
                  ? seqB
                  : Number.MAX_SAFE_INTEGER;

              return finalA - finalB;

            }
          );

          // =================================================
          // CREATE ACTION ARRAY
          // =================================================

          const actionArray =
            this.fb.array<FormGroup>([]);

          // =================================================
          // LOOP ACTIONS
          // =================================================

          dbActions.forEach(
            (dbAction: any) => {

              // =============================================
              // INPUTS
              // =============================================

              const inputArray =
                this.fb.array<FormGroup>([]);

              let dbInputs =
                dbAction?.inputs ?? [];

              if (
                typeof dbInputs === 'string'
              ) {

                try {

                  dbInputs =
                    JSON.parse(dbInputs);

                } catch {

                  dbInputs = [];

                }

              }

              if (
                Array.isArray(dbInputs)
              ) {

                dbInputs.forEach(
                  (dbInput: any) => {

                    const valueArray =
                      this.fb.array<FormGroup>([]);

                    let dbValues =
                      dbInput?.values ?? [];

                    if (
                      typeof dbValues === 'string'
                    ) {

                      try {

                        dbValues =
                          JSON.parse(dbValues);

                      } catch {

                        dbValues = [];

                      }

                    }

                    if (
                      Array.isArray(dbValues)
                    ) {

                      dbValues.forEach(
                        (item: any) => {

                          valueArray.push(

                            this.fb.group({

                              key: [
                                item?.key ?? '',
                                Validators.required
                              ],

                              value: [
                                item?.value ?? '',
                                Validators.required
                              ]

                            })

                          );

                        }
                      );

                    }

                    if (
                      valueArray.length === 0
                    ) {

                      valueArray.push(
                        this.createKeyValue()
                      );

                    }

                    inputArray.push(

                      this.fb.group({

                        inputName: [
                          dbInput?.inputName ?? '',
                          Validators.required
                        ],

                        values:
                          valueArray

                      })

                    );

                  }
                );

              }

              // =============================================
              // CONDITIONS
              // =============================================

              const conditionArray =
                this.fb.array<FormGroup>([]);

              let dbConditions =
                dbAction?.conditions ?? [];

              if (
                typeof dbConditions === 'string'
              ) {

                try {

                  dbConditions =
                    JSON.parse(dbConditions);

                } catch {

                  dbConditions = [];

                }

              }

              if (
                Array.isArray(dbConditions)
              ) {

                dbConditions.forEach(
                  (dbCondition: any) => {

                    const valueArray =
                      this.fb.array<FormGroup>([]);

                    let dbValues =
                      dbCondition?.values ?? [];

                    if (
                      typeof dbValues === 'string'
                    ) {

                      try {

                        dbValues =
                          JSON.parse(dbValues);

                      } catch {

                        dbValues = [];

                      }

                    }

                    if (
                      Array.isArray(dbValues)
                    ) {

                      dbValues.forEach(
                        (item: any) => {

                          valueArray.push(

                            this.fb.group({

                              key: [
                                item?.key ?? '',
                                Validators.required
                              ],

                              value: [
                                item?.value ?? '',
                                Validators.required
                              ]

                            })

                          );

                        }
                      );

                    }

                    if (
                      valueArray.length === 0
                    ) {

                      valueArray.push(
                        this.createKeyValue()
                      );

                    }

                    conditionArray.push(

                      this.fb.group({

                        conditionName: [
                          dbCondition?.conditionName ?? '',
                          Validators.required
                        ],

                        values:
                          valueArray

                      })

                    );

                  }
                );

              }

              // =============================================
              // OUTPUT
              // =============================================

              const outputValues =
                this.fb.array<FormGroup>([]);

              let dbOutputValues =
                dbAction?.output?.values ?? [];

              if (
                typeof dbOutputValues === 'string'
              ) {

                try {

                  dbOutputValues =
                    JSON.parse(dbOutputValues);

                } catch {

                  dbOutputValues = [];

                }

              }

              if (
                Array.isArray(dbOutputValues)
              ) {

                dbOutputValues.forEach(
                  (item: any) => {

                    /*
                     * IMPORTANT
                     * BACKWARD COMPATIBILITY
                     *
                     * Old DB records-la "value" oru
                     * single string (Example: "a").
                     *
                     * Puthu records-la "value" oru
                     * chip array (Example: ["a", "b"]).
                     *
                     * Rendu format-ayum handle pannurom.
                     */

                    let chipValues: string[] = [];

                    if (
                      Array.isArray(item?.value)
                    ) {

                      chipValues =
                        item.value.filter(
                          (v: any) =>
                            typeof v === 'string' &&
                            v.trim() !== ''
                        );

                    } else if (
                      typeof item?.value === 'string' &&
                      item.value.trim() !== ''
                    ) {

                      chipValues = [
                        item.value
                      ];

                    }

                    outputValues.push(

                      this.fb.group({

                        key: [
                          item?.key ?? '',
                          Validators.required
                        ],

                        value: this.fb.array(
                          chipValues,
                          this.minOneChipValidator()
                        )

                      })

                    );

                  }
                );

              }

              if (
                outputValues.length === 0
              ) {

                outputValues.push(
                  this.createOutputEntry()
                );

              }

              // =============================================
              // COMPLETE ACTION
              // =============================================

              const actionGroup =
                this.fb.group({

                  actionName: [
                    dbAction?.actionName ?? '',
                    Validators.required
                  ],

                  sequence: [
                    Number(dbAction?.sequence) || 0
                  ],

                  inputs:
                    inputArray,

                  conditions:
                    conditionArray,

                  output:
                    this.fb.group({

                      outputName: [
                        dbAction?.output?.outputName ?? '',
                        Validators.required
                      ],

                      values:
                        outputValues

                    })

                });

              actionArray.push(
                actionGroup
              );

            }
          );

          // =================================================
          // SET ACTIONS
          // =================================================

          if (
            actionArray.length > 0
          ) {

            this.policyForm.setControl(
              'actions',
              actionArray
            );

          } else {

            this.actions.clear();

            this.addAction();

          }

          // =================================================
          // IMPORTANT
          // AUTOMATIC ACTION SEQUENCE
          // =================================================

          this.updateActionSequences();

          // =================================================
          // DEBUG
          // =================================================

          console.log(
            'FINAL FORM:',
            this.policyForm.getRawValue()
          );

          console.log(
            'FINAL ACTIONS:',
            this.actions.getRawValue()
          );

          this.cdr.detectChanges();

        },

        error: (error: unknown) => {

          console.error(
            'POLICY LOAD ERROR:',
            error
          );

        }

      });

  }

  // =========================================================
  // BACK
  // =========================================================

  goBack(): void {

    if (
      this.isEditMode &&
      this.editingPolicyId
    ) {

      this.router.navigate([
        '/policy',
        this.editingPolicyId
      ]);

      return;

    }

    this.router.navigate([
      '/policy'
    ]);

  }

  // =========================================================
  // GET ACTIONS
  // =========================================================

  get actions(): FormArray {

    return this.policyForm.get(
      'actions'
    ) as FormArray;

  }

  // =========================================================
  // CREATE ACTION
  // =========================================================

  createAction(): FormGroup {

    return this.fb.group({

      actionName: [
        '',
        Validators.required
      ],

      sequence: [
        0
      ],

      inputs:
        this.fb.array([]),

      conditions:
        this.fb.array([]),

      output:
        this.fb.group({

          outputName: [
            '',
            Validators.required
          ],

          values:
            this.fb.array([

              this.createOutputEntry()

            ])

        })

    });

  }

  // =========================================================
  // UPDATE ACTION SEQUENCES
  // =========================================================

  updateActionSequences(): void {

    this.actions.controls.forEach(
      (
        action: any,
        index: number
      ) => {

        action.patchValue(

          {
            sequence: index + 1
          },

          {
            emitEvent: false
          }

        );

      }
    );

    this.actions.updateValueAndValidity();

  }

  // =========================================================
  // ADD ACTION
  // =========================================================

  addAction(): void {

    const action =
      this.createAction();

    this.actions.push(
      action
    );

    const index =
      this.actions.length - 1;

    this.addInput(index);

    this.addCondition(index);

    this.updateActionSequences();

  }

  // =========================================================
  // REMOVE ACTION
  // =========================================================

  removeAction(
    index: number
  ): void {

    if (
      this.actions.length === 1
    ) {

      return;

    }

    this.actions.removeAt(index);

    this.updateActionSequences();

  }

  // =========================================================
  // DRAG & DROP ACTIONS
  // =========================================================

  dropAction(
    event: CdkDragDrop<any[]>
  ): void {

    if (
      event.previousIndex ===
      event.currentIndex
    ) {

      return;

    }

    moveItemInArray(

      this.actions.controls,

      event.previousIndex,

      event.currentIndex

    );

    this.updateActionSequences();

    this.actions.updateValueAndValidity();

    this.cdr.detectChanges();

    console.log(
      'NEW ACTION SEQUENCE:',
      this.actions.getRawValue()
    );

  }

  // =========================================================
  // INPUT
  // =========================================================

  getInputs(
    actionIndex: number
  ): FormArray {

    return this.actions
      .at(actionIndex)
      .get('inputs') as FormArray;

  }

  createInput(): FormGroup {

    return this.fb.group({

      inputName: [
        '',
        Validators.required
      ],

      values:
        this.fb.array([

          this.createKeyValue()

        ])

    });

  }

  addInput(
    actionIndex: number
  ): void {

    this.getInputs(actionIndex)
      .push(

        this.createInput()

      );

  }

  removeInput(
    actionIndex: number,
    inputIndex: number
  ): void {

    this.getInputs(actionIndex)
      .removeAt(inputIndex);

  }

  // =========================================================
  // CONDITION
  // =========================================================

  getConditions(
    actionIndex: number
  ): FormArray {

    return this.actions
      .at(actionIndex)
      .get('conditions') as FormArray;

  }

  createCondition(): FormGroup {

    return this.fb.group({

      conditionName: [
        '',
        Validators.required
      ],

      values:
        this.fb.array([

          this.createKeyValue()

        ])

    });

  }

  addCondition(
    actionIndex: number
  ): void {

    this.getConditions(actionIndex)
      .push(

        this.createCondition()

      );

  }

  removeCondition(
    actionIndex: number,
    conditionIndex: number
  ): void {

    this.getConditions(actionIndex)
      .removeAt(conditionIndex);

  }

  // =========================================================
  // KEY VALUE
  // (Used by INPUTS and CONDITIONS only — unchanged)
  // =========================================================

  createKeyValue(): FormGroup {

    return this.fb.group({

      key: [
        '',
        Validators.required
      ],

      value: [
        '',
        Validators.required
      ]

    });

  }

  // =========================================================
  // OUTPUT ENTRY
  // (key = plain text, value = chip array)
  // =========================================================

  createOutputEntry(): FormGroup {

    return this.fb.group({

      key: [
        '',
        Validators.required
      ],

      value: this.fb.array(
        [],
        this.minOneChipValidator()
      )

    });

  }

  // =========================================================
  // CHIP VALIDATOR
  // At least 1 chip required (mirrors old "value required")
  // =========================================================

  private minOneChipValidator() {

    return (control: AbstractControl) => {

      const arr = control as FormArray;

      return arr && arr.length > 0
        ? null
        : { required: true };

    };

  }

  // =========================================================
  // INPUT VALUES
  // =========================================================

  getInputValues(
    actionIndex: number,
    inputIndex: number
  ): FormArray {

    return this.getInputs(actionIndex)
      .at(inputIndex)
      .get('values') as FormArray;

  }

  addInputValue(
    actionIndex: number,
    inputIndex: number
  ): void {

    this.getInputValues(
      actionIndex,
      inputIndex
    ).push(

      this.createKeyValue()

    );

  }

  removeInputValue(
    actionIndex: number,
    inputIndex: number,
    valueIndex: number
  ): void {

    this.getInputValues(
      actionIndex,
      inputIndex
    ).removeAt(valueIndex);

  }

  // =========================================================
  // INPUT KEY-VALUE DRAG
  // =========================================================

  dropInputValue(
    event: CdkDragDrop<any[]>,
    actionIndex: number,
    inputIndex: number
  ): void {

    if (
      event.previousIndex ===
      event.currentIndex
    ) {

      return;

    }

    const values =
      this.getInputValues(
        actionIndex,
        inputIndex
      );

    moveItemInArray(

      values.controls,

      event.previousIndex,

      event.currentIndex

    );

    values.updateValueAndValidity();

    this.cdr.detectChanges();

  }

  // =========================================================
  // CONDITION VALUES
  // =========================================================

  getConditionValues(
    actionIndex: number,
    conditionIndex: number
  ): FormArray {

    return this.getConditions(actionIndex)
      .at(conditionIndex)
      .get('values') as FormArray;

  }

  addConditionValue(
    actionIndex: number,
    conditionIndex: number
  ): void {

    this.getConditionValues(
      actionIndex,
      conditionIndex
    ).push(

      this.createKeyValue()

    );

  }

  removeConditionValue(
    actionIndex: number,
    conditionIndex: number,
    valueIndex: number
  ): void {

    this.getConditionValues(
      actionIndex,
      conditionIndex
    ).removeAt(valueIndex);

  }

  // =========================================================
  // CONDITION KEY-VALUE DRAG
  // =========================================================

  dropConditionValue(
    event: CdkDragDrop<any[]>,
    actionIndex: number,
    conditionIndex: number
  ): void {

    if (
      event.previousIndex ===
      event.currentIndex
    ) {

      return;

    }

    const values =
      this.getConditionValues(
        actionIndex,
        conditionIndex
      );

    moveItemInArray(

      values.controls,

      event.previousIndex,

      event.currentIndex

    );

    values.updateValueAndValidity();

    this.cdr.detectChanges();

  }

  // =========================================================
  // OUTPUT VALUES (entries — each has key + chip array)
  // =========================================================

  getOutputValues(
    actionIndex: number
  ): FormArray {

    return this.actions
      .at(actionIndex)
      .get('output')
      ?.get('values') as FormArray;

  }

  addOutputValue(
    actionIndex: number
  ): void {

    this.getOutputValues(
      actionIndex
    ).push(

      this.createOutputEntry()

    );

  }

  removeOutputValue(
    actionIndex: number,
    valueIndex: number
  ): void {

    this.getOutputValues(
      actionIndex
    ).removeAt(valueIndex);

  }

  // =========================================================
  // OUTPUT KEY-VALUE DRAG
  // (drags whole entries — key + its chip set)
  // =========================================================

  dropOutputValue(
    event: CdkDragDrop<any[]>,
    actionIndex: number
  ): void {

    if (
      event.previousIndex ===
      event.currentIndex
    ) {

      return;

    }

    const values =
      this.getOutputValues(
        actionIndex
      );

    moveItemInArray(

      values.controls,

      event.previousIndex,

      event.currentIndex

    );

    values.updateValueAndValidity();

    this.cdr.detectChanges();

  }

  // =========================================================
  // OUTPUT CHIPS (the tag list inside one output value entry)
  // =========================================================

  getOutputChips(
    actionIndex: number,
    valueIndex: number
  ): FormArray {

    return this.getOutputValues(actionIndex)
      .at(valueIndex)
      .get('value') as FormArray;

  }

  addOutputChip(
    actionIndex: number,
    valueIndex: number,
    chipValue: string
  ): void {

    const trimmed =
      (chipValue ?? '').trim();

    if (!trimmed) {
      return;
    }

    const chipArray =
      this.getOutputChips(
        actionIndex,
        valueIndex
      );

    const alreadyExists =
      chipArray.controls.some(
        (ctrl) => ctrl.value === trimmed
      );

    if (alreadyExists) {
      return;
    }

    chipArray.push(
      this.fb.control(trimmed)
    );

    chipArray.markAsTouched();

    chipArray.updateValueAndValidity();

  }

  removeOutputChip(
    actionIndex: number,
    valueIndex: number,
    chipIndex: number
  ): void {

    this.getOutputChips(
      actionIndex,
      valueIndex
    ).removeAt(chipIndex);

  }

  // =========================================================
  // SAVE / UPDATE
  // =========================================================

  savePolicy(): void {

    // =======================================================
    // VALIDATION
    // =======================================================

    if (
      this.policyForm.invalid
    ) {

      this.policyForm.markAllAsTouched();

      console.log(
        'FORM INVALID:',
        this.policyForm.getRawValue()
      );

      return;

    }

    // =======================================================
    // PREVENT DOUBLE CLICK
    // =======================================================

    if (this.saving) {

      return;

    }

    this.saving = true;

    // =======================================================
    // IMPORTANT
    // FINAL ACTION SEQUENCE UPDATE
    // =======================================================

    this.updateActionSequences();

    // =======================================================
    // FORM DATA
    // =======================================================

    const formData =
      this.policyForm.getRawValue();

    // =======================================================
    // POLICY DATA
    // =======================================================

    const policyData: PolicyModel = {

      ...formData,

      description:
        'Policy workflow configuration',

      status:
        'Active',

      createdDate:
        new Date().toLocaleDateString('en-GB')

    };

    // =======================================================
    // EDIT MODE
    // =======================================================

    if (
      this.isEditMode &&
      this.editingPolicyId
    ) {

      console.log(
        'UPDATING POLICY:',
        this.editingPolicyId
      );

      this.policyService
        .updatePolicy(
          this.editingPolicyId,
          policyData
        )
        .subscribe({

          next: (
            updatedPolicy: PolicyModel
          ) => {

            console.log(
              'POLICY UPDATED SUCCESSFULLY:',
              updatedPolicy
            );

            console.log(
              'POLICY SEQUENCE:',
              updatedPolicy.sequence
            );

            console.log(
              'ACTION SEQUENCES:',
              updatedPolicy.actions
            );

            this.saving = false;

            this.saveSuccess.set(true);

            setTimeout(() => {

              if (
                this.editingPolicyId
              ) {

                this.router.navigate([
                  '/policy',
                  this.editingPolicyId
                ]);

              }

            }, 1000);

          },

          error: (error: unknown) => {

            this.saving = false;

            console.error(
              'UPDATE ERROR:',
              error
            );

          }

        });

      return;

    }

    // =======================================================
    // CREATE MODE
    // =======================================================

    console.log(
      'CREATING NEW POLICY'
    );

    this.policyService
      .createPolicy(policyData)
      .subscribe({

        next: (
          createdPolicy: PolicyModel
        ) => {

          console.log(
            'POLICY CREATED SUCCESSFULLY:',
            createdPolicy
          );

          console.log(
            'GENERATED POLICY SEQUENCE:',
            createdPolicy.sequence
          );

          console.log(
            'ACTION SEQUENCES:',
            createdPolicy.actions
          );

          this.saving = false;

          this.saveSuccess.set(true);

          setTimeout(() => {

            this.router.navigate([
              '/policy'
            ]);

          }, 1000);

        },

        error: (error: unknown) => {

          this.saving = false;

          console.error(
            'CREATE ERROR:',
            error
          );

        }

      });

  }

}