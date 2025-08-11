API Endpoints Documentation:

1. User Registration
Feature: Create a new user account
HTTP Method: POST
Endpoint Path: /api/users/register
Description: Registers a new user in the system.
Request Body:{
  "username": "Hello",
  "email": "hello@example.com",
  "password": "Password123"
}
Success Response:{
  "message": "User registered successfully",
  "user_id": "abc123"
}
Error Responses:{
  "error": "Email already exists"
}

2. User Login
Feature: Authenticate a user
HTTP Method: POST
Endpoint Path: /api/users/login
Description: Logs in an existing user and returns an authentication token.
Request Body:{
  "email": "hello@example.com",
  "password": "Password123"
}
Success Response:{
  "username": "Hello",
  "user_id": "abc123"
}
Error Responses:{
  "error": "Invalid email or password"
}

3. Itinerary Generation
Feature: Create a new travel plan
HTTP Method: POST
Endpoint Path: /api/itinerary/generate
Description: Saves trip preferences and generates an itinerary.
Request Body:{
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "destination": "Location",
  "budget": XXX,
  "food_choice": "vegetarian | non-vegetarian | vegan",
  "transport_mode": "taxi | rental | public"
}
Success Response:{
  "message": "Trip created successfully",
  "trip_id": "trip123",
  "itinerary": {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "type": "sightseeing | restaurant | hotel | transport",
          "name": "string",
          "details": "string",
          "price": "number",
          "location": "lat, long"
        }
      ]
    }
}
Error Responses:{
  "error": "Invalid location or date format"
}

4. Get Itinerary Generation by ID
Feature: Retrieve Itinerary details
HTTP Method: GET
Endpoint Path: /api/Itinerary/{trip_id}
Description: Fetches trip itinerary and details.
Success Response:{
  "trip_id": "trip123",
  "destination": "Location",
  "itinerary": [...]
}
Error Responses:{
  "error": "Trip not found"
}

5. Restaurant Suggestions
Feature: Get Restaurants
HTTP Method: GET
Endpoint Path: /api/restaurants
Description: Retrieves restaurant recommendations with price comparisons.
Success Response:{
    "name": "string",
    "rating": "number",
    "price_range": "string",
    "address": "string",
    "source": "Zomato | Yelp"
  }
Error Responses:{
  "error": "No restaurants found"
}

6. Hotel Suggestions
Feature: Get Hotels
HTTP Method: GET
Endpoint Path: /api/hotels
Description: Fetches hotel options with live prices.
Success Response:{
    "name": "string",
    "price_per_night": "number",
    "rating": "number",
    "address": "string",
    "source": "Booking.com"
  }
Error Responses:{
  "error": "No Hotels found"
}

7. Transportation Suggestions
Feature: Get Transport Options
HTTP Method: GET
Endpoint Path: /api/transport
Description: Lists available local/rental transport options
Success Response:{
   "type": "taxi | rental | public",
    "name": "string",
    "price": "number",
    "availability": "boolean"
}
Error Responses:{
  "error": "No transport options available"
}
