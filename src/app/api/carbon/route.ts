import { NextResponse } from "next/server";
import { 
  calculateTravelEmission, 
  calculateFoodEmission, 
  calculateEnergyEmission, 
  calculateShoppingEmission, 
  calculateWasteEmission 
} from "../../../lib/carbonCalculator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, activity_type, quantity, unit, metadata = {} } = body;

    const climatiqKey = process.env.CLIMATIQ_API_KEY;
    const carbonInterfaceKey = process.env.CARBON_INTERFACE_API_KEY;

    // Standard fallback response using local carbonCalculator factors
    let co2e = 0;
    let source = "local_calculation";
    let confidence = "High";
    let factor = 0;

    if (category === "travel") {
      co2e = calculateTravelEmission(activity_type, quantity, metadata.trips || 1);
      factor = co2e / (quantity || 1);
    } else if (category === "food") {
      co2e = calculateFoodEmission(activity_type, metadata.delivery || false);
      factor = co2e;
    } else if (category === "energy") {
      co2e = calculateEnergyEmission(
        metadata.acHours || 0,
        metadata.fanHours || 0,
        metadata.lightsHours || 0,
        metadata.devicesCharged || 0,
        activity_type || "moderate"
      );
      factor = co2e;
    } else if (category === "shopping") {
      co2e = calculateShoppingEmission(activity_type);
      factor = co2e;
    } else if (category === "waste") {
      co2e = calculateWasteEmission({
        reusableBottle: metadata.reusableBottle || false,
        plasticBottleBought: metadata.plasticBottleBought || false,
        reusableBagUsed: metadata.reusableBagUsed || false,
        foodWaste: metadata.foodWaste || false,
        recyclingDone: metadata.recyclingDone || false,
      });
      factor = co2e;
    }

    // Try External API if configured
    if (climatiqKey) {
      try {
        // Map simplified modes to Climatiq activity IDs if needed
        let activityId = "transport_car-generic_passenger_car";
        if (category === "travel" && activity_type === "metro") {
          activityId = "passenger_train-route_type_underground-fuel_source_electricity";
        } else if (category === "travel" && activity_type === "bus") {
          activityId = "passenger_vehicle-bus_generic";
        }

        const res = await fetch("https://api.climatiq.io/estimate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${climatiqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emission_factor: {
              activity_id: activityId,
            },
            parameters: {
              distance: quantity,
              distance_unit: "km",
            },
          }),
        });

        if (res.ok) {
          const apiData = await res.json();
          co2e = Number(apiData.co2e.toFixed(2));
          source = "climatiq_api";
          confidence = "Very High";
          factor = apiData.emission_factor.value;
        }
      } catch (err) {
        console.error("Climatiq API call failed, falling back to local:", err);
      }
    } else if (carbonInterfaceKey) {
      try {
        // Map to Carbon Interface estimate endpoint
        const res = await fetch("https://www.carboninterface.com/api/v1/estimates", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${carbonInterfaceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "vehicle",
            distance_unit: "km",
            distance_value: quantity,
            vehicle_model_id: "7268a9b7-17e8-4c80-9ab0-94f74ce415d1", // generic model
          }),
        });

        if (res.ok) {
          const apiData = await res.json();
          co2e = Number(apiData.data.attributes.carbon_kg.toFixed(2));
          source = "carbon_interface_api";
          confidence = "Very High";
        }
      } catch (err) {
        console.error("Carbon Interface API failed, falling back to local:", err);
      }
    }

    return NextResponse.json({
      co2e,
      emission_factor: factor,
      source,
      confidence,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
