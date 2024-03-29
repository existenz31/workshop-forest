import Component from '@glimmer/component';
import { loadExternalStyle, loadExternalJavascript } from 'client/utils/smart-view-utils';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @service eventBus

  filteringPeriod = 'this_month'
  periodOptions = [{name:'This Month', value:'this_month'}, {name:'Last Month', value:'last_week'}, {name:'Last Week', value:'last_month'}]

  filteringOrigin = 1 // default => use mock data to avoid wait the data fetch
  originOptions = [{name:'Mock Data', value: 1},{name:'API Data', value: 2}]
  
  constructor(...args) {
    super(...args);
    var that = this;
    setTimeout(() => {  that.triggerEvent(); }, 300); // Wait x ms to triggerEvent
  }
  
  @action
  triggerEvent() {
    const args = {
      period: this.filteringPeriod,
      origin: this.filteringOrigin
    }
    console.log('trigger filteringChangeEvent')
    this.eventBus.trigger('filteringChangeEvent', args)
  }
 
/*  listenEvent() {
    this.eventBus.on('filteringChangeEvent', (args) => {
      console.log("listen => " + JSON.stringify(args));
    })
  }
*/  
}
