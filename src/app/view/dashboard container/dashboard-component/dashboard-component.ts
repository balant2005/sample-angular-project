import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartData,
  ChartOptions,
  ChartType,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [
    MatCardModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css'],
})

export class DashboardComponent {

  // Right panel
  isOpen = false;
  panelTitle = '';
  panelContent: string[] = [];


  openPanel(type: string) {

    this.isOpen = true;


    if(type === 'health') {

      this.panelTitle = 'Health Status Details';

      this.panelContent = [
        'Healthy Servers : 85',
        'Warning Servers : 10',
        'Critical Servers : 5',
        'Overall Health : Good'
      ];

    }


    else if(type === 'events') {

      this.panelTitle = 'Top Events';

      this.panelContent = [
        'Success Events : 45',
        'Pending Events : 35',
        'Failed Events : 26',
        'Total Events : 106'
      ];

    }


    else {

      this.panelTitle = 'Policies Details';

      this.panelContent = [
        'Active Policies : 54',
        'Expired Policies : 8',
        'Draft Policies : 5',
        'Total Policies : 67'
      ];

    }

  }


  closePanel() {
    this.isOpen = false;
  }


  chartType: 'doughnut' = 'doughnut';


  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };


  eventsData: ChartData<'doughnut'> = {
    labels: ['Success', 'Pending', 'Failed'],
    datasets: [
      {
        data: [45, 35, 26],
        backgroundColor: [
          '#2E3B8F',
          '#5C6BC0',
          '#A9B5FF'
        ],
        borderWidth: 0
      }
    ]
  };


  policyData: ChartData<'doughnut'> = {
    labels: ['Active', 'Expired', 'Draft'],
    datasets: [
      {
        data: [54, 8, 5],
        backgroundColor: [
          '#1C2668',
          '#4558C8',
          '#B9C3FF'
        ],
        borderWidth: 0
      }
    ]
  };

}