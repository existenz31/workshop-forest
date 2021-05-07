const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

router.post('/api/smart-charts/chart-1', async (req, res) => {
  getData().then((data) => {
    res.send(data);
  })
});
function rnd10() {
  return Math.floor(Math.random() * 100)-50
}

function rnd5() {
  let res = Math.floor(Math.random() * 80) - 30
  return res<0?0:res;
}

function getData() {
  return new Promise(function (resolve, reject) {
    const data = {
      lines: [
        {label: 'API Line #1', total: 288 + rnd10(), values: [0+rnd5(), 20+rnd5(), 20+rnd5(), 60+rnd5(), 60+rnd5(), 120+rnd5(), 150+rnd5(), 180+rnd5(), 120+rnd5(), 125+rnd5(), 105+rnd5(), 130+rnd5(), 150+rnd5()]},
        {label: 'API Line #2', total: 304 + rnd10(), values: [0+rnd5(), 0+rnd5(), 0+rnd5(), 50+rnd5(), 50+rnd5(), 100+rnd5(), 130+rnd5(), 150+rnd5(), 150+rnd5(), 105+rnd5(), 90+rnd5(), 80+rnd5(), 70+rnd5()]},
        {label: 'API Line #3', total: 156 + rnd10(), values: [0+rnd5(), 0+rnd5(), 30+rnd5(), 40+rnd5(), 35+rnd5(), 90+rnd5(), 100+rnd5(), 100+rnd5(), 90+rnd5(), 90+rnd5(), 100+rnd5(), 110+rnd5(), 130+rnd5()]}
      ],
      xLabels: ['01-Jun', '02-Jun', '03-Jun', '04-Jun', '05-Jun', '06-Jun', '07-Jun', '08-Jun', '09-Jun', '10-Jun', '11-Jun', '12-Jun', '13-Jun'],
      //yScale: {min: 20, max: 200}
    }
    resolve(data);
});

}  

module.exports = router;