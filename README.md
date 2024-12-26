# Steps 
- Create google cloud account 
- Go to - https://console.cloud.google.com/ (Add payment method)
- Go to (Keys & Credentials tab)
- Create new project
- Get project API keys
- Go to (APIs & Services tab)
- Enable Maps and Places APIs to get nearest places
- API URL
    - Convert address to coordinates (https://maps.googleapis.com/maps/api/geocode/json)
    - Get nearest places (https://maps.googleapis.com/maps/api/place/nearbysearch/json)
- Request via postman
    - POST - http://localhost:3000/near-places
    - Request body 
        - {
            "address": "navrangpura, Ahmedabad, 380009",
            "place": "gym"
          }   

# GeoLocation Apps System-Design
List of apps which are uses geolocation 
- Ridesharing and Transportation
- Travel and Hospitality
- Social Media and Networking
- Food Delivery and Grocery
- Fitness and Health
- Dating and Social Connection
- Retail and E-Commerce
- Weather and News
- Banking and Fintech
- Emergency and Safety

API can find blow places 
- Food & Drink
    - restaurant
    - café
    - bar
    - bakery
- Shops & Services
    - store
    - shopping_mall
    - supermarket
    - laundry
- Health & Medical
    - hospital
    - pharmacy
    - dentist
- Entertainment & Recreation
    - movie_theater
    - museum
    - park
    - gym
- Finance & Government
    - atm
    - bank
    - post_office
- Travel & Transportation
    - airport
    - bus_station
    - train_station
    - car_rental

