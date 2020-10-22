import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MapGL, { GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PieChart } from "react-chartkick";
import "chart.js";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicHJpeWFua2FwcyIsImEiOiJja2cyYzFjY3MxZTc4MnlxZm92d2Y4M3poIn0.7Eb13DlMMMXb-_UnsMgcVg";

const geolocateStyle = {
  display: "inline-block",
  margin: "10px",
  padding: "5px",
};

function Carbon() {
  const [position, setPosition] = useState({
    longitude: 12,
    latitude: 55,
  });

  const onMapClick = (event) => {
    const lng = parseInt(event.lngLat.slice(0, 1));
    const lat = parseInt(event.lngLat.slice(1, 2));
    setPosition({ longitude: lng, latitude: lat });
    getPowerBreakdown();
  };

  const [viewport, setViewport] = useState({
    width: "100%",
    height: 310,
    latitude: 55.676098,
    longitude: 12.568337,
    zoom: 4,
    bearing: 0,
    pitch: 0,
    marker: true,
  });

  const _onViewportChange = (viewport) =>
    setViewport({ ...viewport, transitionDuration: 3000 });

  const [CountryInfo, SetCountryInfo] = useState({
    zone: "DK-DK2",
    fossilFreePercentage: "91",
    renewablePercentage: "85",
    powerConsumptionTotal: "1684",
    powerConsumptionBreakdown: {
      "battery discharge": 0,
      biomass: 276,
      coal: 61,
      gas: 45,
      geothermal: 0,
      hydro: 268,
      "hydro discharge": 5,
      nuclear: 100,
      oil: 14,
      solar: 0,
      unknown: 29,
      wind: 886,
    },
  });

  const getPowerBreakdown = async () => {
    const apiCall = await fetch(
      `https://api.electricitymap.org/v3/power-consumption-breakdown/latest?lat=${position.latitude}&lon=${position.longitude}`,
      {
        method: "GET",
        headers: {
          "auth-token": "rILfhiFrZ3emXcVMGU62",
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    const user = await apiCall.json();
    SetCountryInfo(user);
  };

  // making an array for rechart here

  const chartInput = {
    Biomass: CountryInfo.powerConsumptionBreakdown.biomass,
    coal: CountryInfo.powerConsumptionBreakdown.coal,
    gas: CountryInfo.powerConsumptionBreakdown.gas,
    geothermal: CountryInfo.powerConsumptionBreakdown.geothermal,
    hydro: CountryInfo.powerConsumptionBreakdown.hydro,
    nuclear: CountryInfo.powerConsumptionBreakdown.nuclear,
    oil: CountryInfo.powerConsumptionBreakdown.oil,
    solar: CountryInfo.powerConsumptionBreakdown.solar,
    wind: CountryInfo.powerConsumptionBreakdown.wind,
    Others: CountryInfo.powerConsumptionBreakdown.unknown,
  };

  // environment friendly ratio

  const Mean =
    (parseInt(CountryInfo.fossilFreePercentage) +
      parseInt(CountryInfo.renewablePercentage)) /
    2;

  let GetColor = {};
  let PresentData = {};

  if (!CountryInfo.powerConsumptionTotal) {
    PresentData = "nodata";
  } else {
    PresentData = "hasdata";
  }

  if (Mean > 70) {
    GetColor = "Excellent";
  } else if (Mean > 50) {
    GetColor = "Good";
  } else {
    GetColor = "Poor";
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <h2>How Clean is Your Electricity </h2>
        <p>
          Want to know how environment friendly is the electricity generation in
          you area? Click on any location in the map to find out!!
        </p>
          <small><em>For more accuracy try zooming in.</em></small>

        <div className="row">
          <MapGL
            {...viewport}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v8"
            onViewportChange={_onViewportChange}
            onClick={onMapClick}
          >
            <GeolocateControl
              style={geolocateStyle}
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            />
          </MapGL>
        </div>

        <div className="row pt-4" id={PresentData}>
          <div className="container nodatamsg">
            <h2>Insufficient Data </h2>
            <p>
              We don't have any data related to this location at the moment but
              we are adding more locations into our database. </p>
            <p>  Please try another location for now, Thanks.</p>
            
          </div>
          <div className="Datashow col-5">
            {CountryInfo.zone === "" ? (
              <h3> Welcome, please click on the map to see details</h3>
            ) : CountryInfo.status === "error" ? (
              <h3> This data is not available....</h3>
            ) : (
              <div>
                <h3> Zone {CountryInfo.zone}</h3>
                <h4>
                  is rated <span className={GetColor}>{GetColor}</span>
                </h4>

                <p>for environment friendly electricity consumption</p>
                <ul>
                  <li>
                    Fossil Free Percentage : {CountryInfo.fossilFreePercentage}
                  </li>
                  <li>
                    Renewable Percentage : {CountryInfo.renewablePercentage}
                  </li>
                  <li>
                    Total Power Consumption :{" "}
                    {CountryInfo.powerConsumptionTotal}
                  </li>
                </ul>
              </div>
            )}
            ​
          </div>

          <div className="piechart col-6">
            <PieChart data={chartInput} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carbon;
