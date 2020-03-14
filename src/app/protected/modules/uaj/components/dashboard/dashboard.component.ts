import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'uaj-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  multi: any[] = [{
    "name": ".",
    "series": [
      {
        "name": "2010",
        "value": 73000000
      },
      {
        "name": "2011",
        "value": 89400000
      }
    ]
  }];

  multi1: any[] = [{
    "name": ".",
    "series": [
      {
        "name": "2010",
        "value": 73000000
      },
      {
        "name": "2011",
        "value": 89400000
      },
      {
        "name": "2012",
        "value": 89400000
      }
    ]
  }];

  single1: any[] = [
    {
      "name": "2019",
      "value": 3000
    },
    {
      "name": "2018",
      "value": 500
    },
    {
      "name": "2017",
      "value": 400
    },
    {
      "name": "2016",
      "value": 300
    },
    {
      "name": "2015",
      "value": 100
    }
  ];

  single2: any[] = [
    {
      "name": "UAGS",
      "value": 3000
    },
    {
      "name": "RRHH",
      "value": 500
    },
    {
      "name": "UTI",
      "value": 400
    },
    {
      "name": "UPP",
      "value": 300
    },
    {
      "name": "AUJ",
      "value": 100
    },
    {
      "name": "UA",
      "value": 100
    },
    {
      "name": "UCI",
      "value": 100
    },
    {
      "name": "CT",
      "value": 100
    }
  ];

  single3: any[] = [
    {
      "name": "UAGS",
      "value": 3000
    },
    {
      "name": "RRHH",
      "value": 500
    },
    {
      "name": "UTI",
      "value": 400
    },
    {
      "name": "UPP",
      "value": 300
    },
    {
      "name": "AUJ",
      "value": 100
    },
    {
      "name": "UA",
      "value": 100
    },
    {
      "name": "UCI",
      "value": 100
    },
    {
      "name": "CT",
      "value": 100
    }
  ];


  colorConvenioPais = {
    domain: ['#6D599B', '#A7C1DE']
  };

  colorBarraConvenioPais = {
    domain: ['#AFCDA2', '#A7C1DE', '#6D599B', '#ADC337', '#C85D97']
  };

  colorConvenioActivos = {
    domain: ['#A7C1DE', '#7C7C7C', '#E1AB96']
  };

  colorBarraConvenioActivos = {
    domain: ['#AFCDA2', '#7C7C7C', '#C85D97', '#ADC337', '#6D599B', '#A7C1DE', '#E1AB96', '#EECD88']
  };

  colorConvenioFinalizados = {
    domain: ['#7C7C7C', '#C85D97']
  };

  colorBarraConvenioFinalizados = {
    domain: ['#AFCDA2', '#7C7C7C', '#C85D97', '#ADC337', '#6D599B', '#A7C1DE', '#E1AB96', '#EECD88']
  };

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onSelect(event) {
    console.log(event);
    this.router.navigate([`/uaj/convenio-bandeja`]);
  }

}
