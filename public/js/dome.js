var app = angular.module("myapp", []);
app.controller("myctrl", ($scope, $http, $window) => {
  $scope.updateall = () => {
    const pathArray = window.location.pathname.split("/");
    if (
      !$scope.templow ||
      !$scope.temphigh ||
      !$scope.temphl ||
      !$scope.temphh ||
      !$scope.humiditylow ||
      !$scope.humidityhigh ||
      !$scope.humidityhhl ||
      !$scope.humidityhhh ||
      !$scope.co2low ||
      !$scope.co2high ||
      !$scope.moisturelow ||
      !$scope.moisturehigh
    ) {
      $scope.message =
        "Please Fill All The Details ! \n And All Values Should be Under 100.";
      myModal.show();
    } else {
      $http({
        method: "POST",
        url: `/addthreshhold/${pathArray[2]}`,
        data: {
          re_temp_low: $scope.templow,
          re_temp_high: $scope.temphigh,
          re_temp_hl: $scope.temphl,
          re_temp_hh: $scope.temphh,
          re_humidity_low: $scope.humiditylow,
          re_humidity_high: $scope.humidityhigh,
          re_humidity_hl: $scope.humidityhhl,
          re_humidity_hh: $scope.humidityhhh,
          re_co2_low: $scope.co2low,
          re_co2_high: $scope.co2high,
          re_soilmoisture_low: $scope.moisturelow,
          re_soilmoisture_high: $scope.moisturehigh,
        },
      }).then(
        (response) => {
          console.log(response.data);
          $scope.message = response.data.message;
          myModal.show();
          $scope.getrefvalues();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  $scope.getallcurvalue = () => {
    const pathArray = window.location.pathname.split("/");
    $http.get(`/getsensordata/${pathArray[2]}`).then(
      (response) => {
        console.log(response.data);
        $scope.responsefromapi = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  $scope.getrefvalues = () => {
    const pathArray = window.location.pathname.split("/");
    $http.get(`/getrefvalues/${pathArray[2]}`).then(
      (response) => {
        $scope.refvalues = response.data;
      },
      (error) => {
        alert("something Went Wrong ! ");
      }
    );
  };

  $scope.currentstatusofperiph = {};

  function getStatus(currentHour, currentstatusofperiph) {
    const statuses = {
      fan1: "❌",
      fan2: "❌",
      vent1: "❌",
      vent2: "❌",
      vent3: "❌",
      vent4: "❌",
      heater: "❌",
      mistyrise: "❌",
      dehumidifier: "❌",
    };

    const cu_temp = currentstatusofperiph.cu_temp;
    const re_temp_low = currentstatusofperiph.re_temp_low;
    const re_temp_high = currentstatusofperiph.re_temp_high;
    const re_temp_hl = currentstatusofperiph.re_temp_hl;
    const re_temp_hh = currentstatusofperiph.re_temp_hh;

    const cu_humidity = currentstatusofperiph.cu_humidity;
    const re_humidity_low = currentstatusofperiph.re_humidity_low;
    const re_humidity_high = currentstatusofperiph.re_humidity_high;
    const re_humidity_hh = currentstatusofperiph.re_humidity_hh;
    const re_humidity_hl = currentstatusofperiph.re_humidity_hl;

    const re_co2_low = currentstatusofperiph.re_co2_low;
    const re_co2_high = currentstatusofperiph.re_co2_high;
    const re_soilmoisture_low = currentstatusofperiph.re_soilmoisture_low;
    const re_soilmoisture_high = currentstatusofperiph.re_soilmoisture_high;

    if (6 <= currentHour && currentHour <= 17) {
      if (cu_temp >= re_temp_low && cu_temp <= re_temp_high) {
        statuses.fan1 = "✅";
        statuses.fan2 = "❌";
        statuses.vent1 = "✅";
        statuses.vent2 = "❌";
        statuses.vent3 = "✅";
        statuses.vent4 = "❌";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_temp > re_temp_high && cu_temp <= re_temp_hh) {
        statuses.fan1 = "✅";
        statuses.fan2 = "✅";
        statuses.vent1 = "✅";
        statuses.vent2 = "✅";
        statuses.vent3 = "✅";
        statuses.vent4 = "✅";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_temp > re_temp_hh) {
        statuses.fan1 = "✅";
        statuses.fan2 = "✅";
        statuses.vent1 = "✅";
        statuses.vent2 = "✅";
        statuses.vent3 = "✅";
        statuses.vent4 = "✅";
        statuses.heater = "❌";
        statuses.mistyrise = "✅";
        statuses.dehumidifier = "❌";
      } else if (cu_temp >= re_temp_hl && cu_temp < re_temp_low) {
        statuses.fan1 = "✅";
        statuses.fan2 = "❌";
        statuses.vent1 = "❌";
        statuses.vent2 = "❌";
        statuses.vent3 = "✅";
        statuses.vent4 = "❌";
        statuses.heater = "✅";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_temp < re_temp_hl) {
        statuses.fan1 = "❌";
        statuses.fan2 = "❌";
        statuses.vent1 = "❌";
        statuses.vent2 = "❌";
        statuses.vent3 = "❌";
        statuses.vent4 = "❌";
        statuses.heater = "✅";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      }
    } else {
      if (cu_temp >= re_temp_low && cu_temp <= re_temp_high) {
        statuses.fan1 = "✅";
        statuses.fan2 = "❌";
        statuses.vent1 = "✅";
        statuses.vent2 = "❌";
        statuses.vent3 = "✅";
        statuses.vent4 = "❌";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_temp > re_temp_high && cu_temp <= re_temp_hh) {
        statuses.fan1 = "✅";
        statuses.fan2 = "✅";
        statuses.vent1 = "✅";
        statuses.vent2 = "❌";
        statuses.vent3 = "✅";
        statuses.vent4 = "❌";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_temp > re_temp_hh) {
        statuses.fan1 = "✅";
        statuses.fan2 = "✅";
        statuses.vent1 = "✅";
        statuses.vent2 = "✅";
        statuses.vent3 = "✅";
        statuses.vent4 = "✅";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_temp >= re_temp_hl && cu_temp < re_temp_low) {
        statuses.fan1 = "✅";
        statuses.fan2 = "✅";
        statuses.vent1 = "❌";
        statuses.vent2 = "❌";
        statuses.vent3 = "❌";
        statuses.vent4 = "❌";
        statuses.heater = "✅";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_temp < re_temp_hl) {
        statuses.fan1 = "❌";
        statuses.fan2 = "❌";
        statuses.vent1 = "❌";
        statuses.vent2 = "❌";
        statuses.vent3 = "❌";
        statuses.vent4 = "❌";
        statuses.heater = "✅";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      }
      if (cu_humidity > re_humidity_high && cu_humidity <= re_humidity_hh) {
        statuses.fan1 = "✅";
        statuses.fan2 = "❌";
        statuses.vent1 = "✅";
        statuses.vent2 = "❌";
        statuses.vent3 = "✅";
        statuses.vent4 = "❌";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "✅";
      } else if (cu_humidity > re_humidity_hh) {
        statuses.fan1 = "✅";
        statuses.fan2 = "✅";
        statuses.vent1 = "✅";
        statuses.vent2 = "✅";
        statuses.vent3 = "✅";
        statuses.vent4 = "✅";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "✅";
      } else if (
        cu_humidity >= re_humidity_hl &&
        cu_humidity <= re_humidity_low
      ) {
        statuses.fan1 = "✅";
        statuses.fan2 = "❌";
        statuses.vent1 = "❌";
        statuses.vent2 = "❌";
        statuses.vent3 = "✅";
        statuses.vent4 = "❌";
        statuses.heater = "❌";
        statuses.mistyrise = "❌";
        statuses.dehumidifier = "❌";
      } else if (cu_humidity < re_humidity_hl) {
        statuses.fan1 = "❌";
        statuses.fan2 = "❌";
        statuses.vent1 = "❌";
        statuses.vent2 = "❌";
        statuses.vent3 = "❌";
        statuses.vent4 = "❌";
        statuses.heater = "❌";
        statuses.mistyrise = "✅";
        statuses.dehumidifier = "❌";
      }
    }
    return statuses;
  }

  $scope.makechangeincurrentvalues = () => {
    const pathArray = window.location.pathname.split("/");
    $http.get(`/getthreshholdvalue/${pathArray[2]}`).then(
      (response) => {
        $scope.currentstatusofperiph = response.data.led[0];
        const currentHour = new Date().getHours();
        console.log(currentHour);
        $scope.statuses = getStatus(currentHour, $scope.currentstatusofperiph);
      },
      (error) => {
        alert("Something Went Wrong!");
      }
    );
  };

  $scope.makechangeincurrentvalues();
});
