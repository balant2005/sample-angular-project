import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

export interface PolicyModel {
  id?: string | number;

  policyName: string;
  sourceName: string;
  variableName: string;

  // Automatically generated
  sequence?: number;

  description?: string;
  status?: string;
  createdDate?: string;

  actions: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  private apiUrl = 'http://localhost:3001/policies';

  private appliedFromDate = '';

  private appliedToDate = '';

  constructor(
    private http: HttpClient
  ) {}


  getAppliedDateFilter(): {
    fromDate: string;
    toDate: string;
  } {

    return {
      fromDate: this.appliedFromDate,
      toDate: this.appliedToDate
    };

  }


  setAppliedDateFilter(
    fromDate: string,
    toDate: string
  ): void {

    this.appliedFromDate = fromDate;
    this.appliedToDate = toDate;

  }


  clearAppliedDateFilter(): void {

    this.appliedFromDate = '';
    this.appliedToDate = '';

  }


  // =========================================================
  // SORT HELPER
  // =========================================================

  /*
   * IMPORTANT
   *
   * Idhu ella idangalilayum (policies, actions)
   * "sequence" field vachi sort panna use aagum.
   *
   * sequence illama irukura / invalid items
   * (0, undefined, NaN) kadaisi-la than varum.
   */

  private sortBySequence<
    T extends { sequence?: number }
  >(
    items: T[]
  ): T[] {

    return [...items].sort(
      (a: T, b: T) => {

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

  }


  // =========================================================
  // GET ALL POLICIES
  // =========================================================

  getPolicies(): Observable<PolicyModel[]> {

    return this.http.get<PolicyModel[]>(
      this.apiUrl
    ).pipe(

      map((policies: PolicyModel[]) => {

        /*
         * db.json-la manual-ah sequence number
         * edit pannina odane, list output-um
         * automatic-ah andha order-la than varum.
         */

        return this.sortBySequence(policies);

      })

    );

  }


  // =========================================================
  // GET SINGLE POLICY
  // =========================================================

  getPolicyById(
    id: string | number
  ): Observable<PolicyModel> {

    return this.http.get<PolicyModel>(
      `${this.apiUrl}/${id}`
    ).pipe(

      map((policy: PolicyModel) => {

        /*
         * IMPORTANT
         *
         * Single policy fetch pannumbodhu,
         * adhula irukura "actions" array-um
         * sequence vachi sort pannurom.
         *
         * Idhu than Policy Details (view) page-um,
         * Edit form-um use pannura method.
         *
         * Idhu illama, db.json-la action sequence
         * manual-ah change pannina, andha change
         * UI-la reflect aagadhu.
         */

        const actions =
          Array.isArray(policy.actions)
            ? policy.actions
            : [];

        const sortedActions =
          this.sortBySequence(actions);

        return {

          ...policy,

          actions: sortedActions

        };

      })

    );

  }


  // =========================================================
  // CREATE POLICY
  // =========================================================

  createPolicy(
    policy: PolicyModel
  ): Observable<PolicyModel> {

    return this.getPolicies().pipe(

      switchMap((policies: PolicyModel[]) => {

        /*
         * Existing DB-la sequence irundha adha use pannum.
         *
         * Old records-la sequence illana:
         * array index + 1 use pannum.
         */

        const sequences = policies.map(
          (item: PolicyModel, index: number) => {

            const existingSequence =
              Number(item.sequence);

            if (
              Number.isFinite(existingSequence) &&
              existingSequence > 0
            ) {
              return existingSequence;
            }

            return index + 1;

          }
        );

        const maxSequence =
          sequences.length > 0
            ? Math.max(...sequences)
            : 0;

        /*
         * IMPORTANT
         *
         * Field order explicit-a set panrom.
         * Ippadi pannina, json-server save panra
         * ella records-um SAME key order-la than varum.
         */

        const newPolicy: PolicyModel = {

          policyName: policy.policyName,
          sourceName: policy.sourceName,
          variableName: policy.variableName,

          sequence: maxSequence + 1,

          actions: policy.actions,

          description: policy.description,
          status: policy.status,
          createdDate: policy.createdDate

        };

        return this.http.post<PolicyModel>(
          this.apiUrl,
          newPolicy
        );

      })

    );

  }


  // =========================================================
  // UPDATE POLICY
  // =========================================================

  updatePolicy(
    id: string | number,
    policy: PolicyModel
  ): Observable<PolicyModel> {

    /*
     * Edit pannumbodhu existing policy-oda
     * sequence preserve pannuvom.
     *
     * Old DB record-ku sequence illana,
     * current array position based-a sequence assign pannum.
     */

    return this.getPolicies().pipe(

      switchMap((policies: PolicyModel[]) => {

        const index =
          policies.findIndex(
            (item: PolicyModel) =>
              String(item.id) === String(id)
          );

        const existingPolicy =
          index >= 0
            ? policies[index]
            : undefined;

        const existingSequence =
          Number(existingPolicy?.sequence);

        const finalSequence =
          Number.isFinite(existingSequence) &&
          existingSequence > 0
            ? existingSequence
            : index >= 0
              ? index + 1
              : undefined;

        /*
         * IMPORTANT
         *
         * Idhulayum field order explicit-a set panrom,
         * so save aana record-oda key order consistent-ah irukkum.
         */

        const updatedPolicy: PolicyModel = {

          policyName: policy.policyName,
          sourceName: policy.sourceName,
          variableName: policy.variableName,

          sequence:
            finalSequence !== undefined
              ? finalSequence
              : policy.sequence,

          actions: policy.actions,

          description: policy.description,
          status: policy.status,
          createdDate: policy.createdDate

        };

        return this.http.put<PolicyModel>(
          `${this.apiUrl}/${id}`,
          updatedPolicy
        );

      })

    );

  }


  // =========================================================
  // DELETE POLICY
  // =========================================================

  deletePolicy(
    id: string | number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}