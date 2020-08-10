const axios = require('axios');

exports.handler = async function (event, context) {
    let RAPIDAPI_KEY;

    // Access API key from environment
    RAPIDAPI_KEY = process.env.RAPIDAPI_KEY

    // Validate HTTP request type
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    // Get the body of the request
    const body = JSON.parse(event.body)

    // Assign the location value to the variable location from the body object
    const { location } = body

    // Encode the variable so we can send the location in a URL
    const encodedLocation = encodeURIComponent(location)

    try {
        // Call the Weather API
        const { data } = await axios({
            method: "GET",
            url: `https://aerisweather1.p.rapidapi.com/observations/${encodedLocation}`,
            headers: {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "aerisweather1.p.rapidapi.com",
                "x-rapidapi-key": RAPIDAPI_KEY,
                "useQueryString": true
            }
        })

        // Pull the information that we need from the Weather API response
        const weatherData = {
            conditions: data.response.ob.weather,
            tempC: data.response.ob.tempC,
            tempF: data.response.ob.tempF
        }

        // Return the data object
        return {
            statusCode: 200,
            body: JSON.stringify(weatherData)
        }
    } catch (e) {
        console.log(e)
        return {
            statusCode: 500,
            body: 'Server error.'
        }
    }
}