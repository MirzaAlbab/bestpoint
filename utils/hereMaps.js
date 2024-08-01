const ExpressError = require("./ErrorHandler");
const baseUrl = "https://geocode.search.hereapi.com/v1";
const apiKey = "4-AeFpFEFXi9ZvlY1X0Wm-aMYU3-Sk5bA45_LUMfyJY";

const geocode = async (address) => {
  const url = `${baseUrl}/geocode?q=${address}&limit1&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0];
  } catch (error) {
    throw new ExpressError("Failed to geocode address", 500);
  }
};

const geometry = async (address) => {
  try {
    const { position } = await geocode(address);
    return {
      type: "Point",
      coordinates: [position.lng, position.lat],
    };
  } catch (error) {
    throw new ExpressError(error.message, 500);
  }
};

module.exports = { geocode, geometry };
