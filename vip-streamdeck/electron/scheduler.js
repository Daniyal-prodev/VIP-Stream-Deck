const fs = require("fs");
const path = require("path");
const { triggerAlert } = require("./alert");

const file = path.join(__dirname, "../data/schedules.json");

setInterval(() => {
  const now = new Date().toTimeString().slice(0,5);
  const data = JSON.parse(fs.readFileSync(file));

  data.forEach(button => {
    button.alerts.forEach(alert => {
      if (alert.time === now && !alert.triggered) {
        alert.triggered = true;
        triggerAlert(button.button + " Alert");
      }
    });
  });

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}, 1000);
