import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import MapGL, { GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicHJpeWFua2FwcyIsImEiOiJja2cyYzFjY3MxZTc4MnlxZm92d2Y4M3poIn0.7Eb13DlMMMXb-_UnsMgcVg";

const geolocateStyle = {};

function Carbon() {
  const [position, setPosition] = useState({
    longitude: 48.8566,
    latitude: 2.3522,
  });

  const onMapClick = (event) => {
    const lng = event.lngLat.slice(0, 1);
    const lat = event.lngLat.slice(1, 2);
    setPosition({ longitude: lng, latitude: lat });
    getPowerBreakdown();
  };

  const [viewport, setViewport] = useState({
    width: "100%",
    height: 400,
    latitude: 55.676098,
    longitude: 12.568337,
    zoom: 5,
    bearing: 0,
    pitch: 0,
    marker: true,
  });

  const _onViewportChange = (viewport) =>
    setViewport({ ...viewport, transitionDuration: 3000 });

  const [CountryInfo, SetCountryInfo] = useState({ zone: "" });

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

  if (!CountryInfo) {
    console.log("Page is loading please wait.....");
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <h2>See the carbon emission </h2>
        <p>
          Select a country name and see the carbon emission in that country.
        </p>
        <div>
          <div>
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
            ;
          </div>

          <div className="Datashow" id="Datashow">
            {CountryInfo.zone === "" ? (
              <h3> Welcome, please click on the map to see details</h3>
            ) : CountryInfo.status === "error" ? (
              <h3> This data is not available....</h3>
            ) : (
              <div>
                <h3> Zone {CountryInfo.zone}</h3>
                <ul>
                  <li>datetime: {CountryInfo.datetime}</li>
                  <li>
                    fossilFreePercentage: {CountryInfo.fossilFreePercentage}
                  </li>
                  <li>
                    powerConsumptionTotal: {CountryInfo.powerConsumptionTotal}
                  </li>
                  <li>
                    renewablePercentage: {CountryInfo.renewablePercentage}
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    biomass: {CountryInfo.powerConsumptionBreakdown.biomass}
                  </li>
                  <li>coal: {CountryInfo.powerConsumptionBreakdown.coal}</li>
                  <li>gas: {CountryInfo.powerConsumptionBreakdown.gas}</li>
                  <li>
                    geothermal:{" "}
                    {CountryInfo.powerConsumptionBreakdown.geothermal}
                  </li>
                  <li>hydro: {CountryInfo.powerConsumptionBreakdown.hydro}</li>
                  <li>
                    nuclear: {CountryInfo.powerConsumptionBreakdown.nuclear}
                  </li>
                  <li>oil: {CountryInfo.powerConsumptionBreakdown.oil}</li>
                  <li>solar: {CountryInfo.powerConsumptionBreakdown.solar}</li>
                  <li>
                    Others: {CountryInfo.powerConsumptionBreakdown.unknown}
                  </li>
                  <li>wind: {CountryInfo.powerConsumptionBreakdown.wind}</li>
                </ul>
              </div>
            )}
            ​
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carbon;
