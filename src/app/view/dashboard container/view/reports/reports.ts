import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartData,
  ChartOptions,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BaseChartDirective,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {


  // Revenue Line Chart
  revenueData: ChartData<'line'> = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun'
    ],
    datasets: [
      {
        label: 'Revenue (Lakhs)',
        data: [
          45,
          58,
          62,
          80,
          95,
          120
        ],
        borderColor: '#3949ab',
        backgroundColor: '#3949ab33',
        tension: 0.4,
        fill: true
      }
    ]
  };


  // Department Chart
  departmentData: ChartData<'bar'> = {
    labels: [
      'Finance',
      'IT',
      'HR',
      'Sales'
    ],
    datasets: [
      {
        label: 'Performance %',
        data: [
          98,
          92,
          85,
          89
        ],
        backgroundColor: [
          '#3949ab',
          '#5c6bc0',
          '#7986cb',
          '#9fa8da'
        ]
      }
    ]
  };


  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };


  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false
  };


  reports = [
    {
      department: 'Finance',
      manager: 'Arun',
      status: 'Completed',
      progress: 100
    },
    {
      department: 'IT',
      manager: 'Kumar',
      status: 'In Progress',
      progress: 70
    },
    {
      department: 'HR',
      manager: 'Priya',
      status: 'Review',
      progress: 85
    }
  ];

}