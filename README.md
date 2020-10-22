# Tomorrow

A small app for saving Tomorrow

This is a react based app which can act as a platform to make consumers aware on the type of usage of energy. How much environment friendly is the energy consumption or its source. This will give an opportunity to the consumer to move from non renewable source of electricity towards renewable source.
The app lets the user select a particular location on the world map. The accuracy of the location increases if you zoom in. On clicking the location, the app displays the following information:

-datetime
-fossilFreePercentage
-powerConsumptionTotal
-renewablePercentage
-biomass
-coal
-gas
-geothermal
-hydro
-nuclear
-oil
-solar
-Others
-wind

Based on predefined threshold, the app categorizes the consumption into a pie chart with clear division of the share each electricity generation source occupies in that region.Then we have a color indicator which is calculated internally as a mean of the fossilFreePercentage & renewablePercentage parameter values. On the scaler of 1 to 100,shades of green, amber and red depicts how eco friendly is the source of electricity generation in that area. Green indicates high alignment with our environment.
