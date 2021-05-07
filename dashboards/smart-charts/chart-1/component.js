import Component from '@glimmer/component';
import { loadExternalStyle, loadExternalJavascript } from 'client/utils/smart-view-utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class extends Component {
  @service lianaServerFetch
  @service eventBus
  
  @tracked loaded = false
  
  @tracked data = {}
  
  myChar = null
  
  mockData() {
    return {
      lines: [
        {label: 'QR Code Scans', total: 288 + this.rnd10(), values: [0+this.rnd5(), 20+this.rnd5(), 20+this.rnd5(), 60+this.rnd5(), 60+this.rnd5(), 120+this.rnd5(), 150+this.rnd5(), 180+this.rnd5(), 120+this.rnd5(), 125+this.rnd5(), 105+this.rnd5(), 130+this.rnd5(), 150+this.rnd5()]},
        {label: '# Borrowings', total: 304 + this.rnd10(), values: [0+this.rnd5(), 0+this.rnd5(), 0+this.rnd5(), 50+this.rnd5(), 50+this.rnd5(), 100+this.rnd5(), 130+this.rnd5(), 150+this.rnd5(), 150+this.rnd5(), 105+this.rnd5(), 90+this.rnd5(), 80+this.rnd5(), 70+this.rnd5()]},
        {label: 'Clicks on website', total: 156 + this.rnd10(), values: [0+this.rnd5(), 0+this.rnd5(), 30+this.rnd5(), 40+this.rnd5(), 35+this.rnd5(), 90+this.rnd5(), 100+this.rnd5(), 100+this.rnd5(), 90+this.rnd5(), 90+this.rnd5(), 100+this.rnd5(), 110+this.rnd5(), 130+this.rnd5()]}
      ],
      xLabels: ['01-May', '02-May', '03-May', '04-May', '05-May', '06-May', '07-May', '08-May', '09-May', '10-May', '11-May', '12-May', '13-May'],
      //yScale: {min: 20, max: 200}
    }
  }  
  
  constructor(...args) {
    super(...args);
    this.listenEvent();
    this.loadPlugin();
    
/*    this.fetchData({origin: 1}).then(() => {
      this.loadPlugin();
    })*/

  }
  
  @action
  async refresh() {
    //console.log('refresh')
    this.eventBus.trigger('filteringChangeEvent', {
      period: 'last_month', 
      origin: 2})
  }
  
  listenEvent() {
    this.eventBus.on('filteringChangeEvent', async (args) => {
//      console.log("listen => " + JSON.stringify(args));
      //console.log("listen => " + JSON.stringify(args));
      this.fetchData(args).then(() => {
        this.renderChart();
      })
    })
  }

  async loadPlugin() {
    //await loadExternalJavascript('https://cdn.jsdelivr.net/npm/chart.js');
    //await loadExternalJavascript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js');
    await loadExternalJavascript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js');

    this.loaded = true;
    this.renderChart()
  }

  rnd10() {
    return Math.floor(Math.random() * 100)-50
  }
  
  rnd5() {
    let res = Math.floor(Math.random() * 80) - 30
    return res<0?0:res;
  }
  
  async fetchData(args) {
    console.log('fetch => ' + args.origin)
    if (args.origin == 2) {
      const response = await this.lianaServerFetch.fetch('/forest/api/smart-charts/chart-1', {
       method: 'POST',
       body: JSON.stringify(args)
      });
      this.data = await response.json();
    }
    else {
      this.data = this.mockData();
    }
  }
  


  @action
  async renderChart() {
    if (!this.loaded) { return; }
    var ctx = document.getElementById('myDiv-chartjs');
    //console.log(ctx);
    
    var config = this.loadConfig();
    if (!this.myChart) {
      this.myChart = new Chart(ctx, config);
      //this.myChart.destroy();
    }
    else {
      //console.log("data" + this.data.lines[0].total)
      this.myChart.data = config.data;
      this.myChart.update();
    }
//  this.myChart = new Chart(ctx, config);
  }
  
  loadConfig() {
    const data = {
      labels: this.data.xLabels,
      datasets: [
        {
          label: this.data.lines[0].label,
          data: this.data.lines[0].values,
          borderColor: 'rgba(113, 191, 90, 1)',
          fill: false,
          tension: 0.4
        }, {
          label: this.data.lines[1].label,
          data: this.data.lines[1].values,
          borderColor: 'rgba(156, 31, 214, 1)',
          fill: false,
          tension: 0.4
        }, {
          label: this.data.lines[2].label,
          data: this.data.lines[2].values,
          borderColor: 'rgba(214, 153, 31, 1)',
          fill: false,
          tension: 0.4
        }
      ]
    };
    
    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true
            }
          },
          y: {
            display: true,
            title: {
              display: false,
            },
            //suggestedMin: this.data.yScale.min,
            //suggestedMax: this.data.yScale.max
          }
        }
      },
    };  
    return config;
  }
}


    