/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

/*********/


// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	updateSystemStatus();
	const status = fs.readFileSync('status.json')

	return JSON.parse(status)
}

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = () => {
	try{
		let all_resv = fs.readFileSync("reservations.json")	
		let all_rest = fs.readFileSync("restaurants.json")
		all_resv = JSON.parse(all_resv)
		all_rest = JSON.parse(all_rest)
		let busiest = 0
		let index = -1
		for (let i =0; i<all_rest.length; i++){
			if (all_rest[i].numReservations > busiest){
				busiest = all_rest[i].numReservations
				index = i
			}
		}
		if (index != -1){
			let status = {numRestaurants:all_rest.length, totalReservations:all_resv.length, currentBusiestRestaurantName:all_rest[index].name, systemStartTime:new Date()}
			fs.writeFileSync('status.json', JSON.stringify(status))
		}
		else{
			let status = {
				numRestaurants: 0,
				totalReservations: 0,
				currentBusiestRestaurantName: null,
				systemStartTime: new Date(),
			}
			fs.writeFileSync('status.json', JSON.stringify(status))
		}
	}
	catch(error){
		
	}
	/* Add your code below */
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	fs.writeFileSync("restaurants.json",JSON.stringify(restaurants))

};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync("reservations.json", JSON.stringify(reservations))
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
	// Check for duplicate names
	const restaurant = {"name":name,"description":description,"numReservations":0};
	if (!fs.existsSync("restaurants.json")){
		saveRestaurantsToJSONFile([restaurant])
		return [restaurant]
	}
	else{
		let existing = fs.readFileSync("restaurants.json")
		existing = JSON.parse(existing)
		for (let i = 0; i < existing.length; i++){
			if (existing[i].name == name){
				return []
			}
		}
		existing.push(restaurant)
		saveRestaurantsToJSONFile(existing)
		return [restaurant]
	}
}

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	try{
		let all_restaurants = fs.readFileSync("restaurants.json")
		all_restaurants = JSON.parse(all_restaurants)
		all_restaurants.forEach(item => {
			if (item.name == restaurant){
				item.numReservations += 1
			}
		})
		fs.writeFileSync("restaurants.json", JSON.stringify(all_restaurants))
		const reservation = {"restaurant": restaurant,"time":new Date(time),"people":people}
		if (!fs.existsSync("reservations.json")){
			saveReservationsToJSONFile([reservation])
		}
		else{
			let existing_reserv = fs.readFileSync("reservations.json")
			existing_reserv = JSON.parse(existing_reserv)
			existing_reserv.push(reservation)
			saveReservationsToJSONFile(existing_reserv)
		}
		return reservation;
	}
	catch(error){
		console.log(error)
	}
}

/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	try{
		let all_restaurants = fs.readFileSync("restaurants.json")
		return JSON.parse(all_restaurants)
	}
	catch(error){
		console.log(error)
		return []
	}
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
	/* Add your code below */
	try{
		let all_rest = fs.readFileSync("restaurants.json")
		return JSON.parse(all_rest)
	}
	catch(error){
		console.log(error)
	}
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
  try{
	const all_reserv = fs.readFileSync("reservations.json")
	all_reserv.forEach()
  }
  catch(error){
	console.log(error)
  }
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	try{
		let all_reserv = fs.readFileSync("reservations.json")
		all_reserv = JSON.parse(all_reserv)
		let rest_resev = all_reserv.filter(item => item.restaurant === name)
		// let sorted = sort_all_reserv(rest_resev)
		rest_resev.sort(function(a,b){
			return new Date(a.time)-new Date(b.time)
		})
		return rest_resev
	}
	catch(error){
		console.log(error)
	}
};

// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	try{
		let all_reserv = fs.readFileSync("reservations.json")
		all_reserv = JSON.parse(all_reserv)
		let valid_date = []
		for (let i = 0; i<all_reserv.length; i++){
			if (datetime.subtract(new Date(all_reserv[i].time),new Date(time)).toSeconds()>=0 &&
		 datetime.subtract(datetime.addHours(new Date(time),1),new Date(all_reserv[i].time)).toSeconds() >0){
			valid_date.push(all_reserv[i])
		 }
		}
		valid_date.sort(function(a,b){
			return new Date(a.time)-new Date(b.time)
		})
		return valid_date
	}
	catch(error){
		console.log(error)
	}
}

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {
	try{
		let all_reserv = fs.readFileSync("reservations.json")
		let all_rest = fs.readFileSync("restaurants.json")
		all_reserv = JSON.parse(all_reserv)
		all_rest = JSON.parse(all_rest)
		if (all_reserv.length === 0){
			return []
		}
		else{
			all_reserv.sort(function(a,b){
				return new Date(a.time)-new Date(b.time)
			})
			for (let i = 0; i< all_reserv.length;i++){
				if (all_reserv[i].restaurant == restaurantName){
					let k = all_reserv.splice(i, 1)
					fs.writeFileSync("reservations.json", JSON.stringify(all_reserv))
					all_rest.forEach(item => {
						if (item.name === restaurantName){
							item.numReservations += -1
						}
					})
					fs.writeFileSync("restaurants.json", JSON.stringify(all_rest))
					return k
				}
			}
			return []
		}
	}
	catch(error){
		console.log(error)
	}
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method
	try{
		let all_reserv = fs.readFileSync("reservations.json")
		all_reserv = JSON.parse(all_reserv)
		all_reserv.forEach(item => {
			if (item.restaurant === restaurant){
				item.time = datetime.addMinutes(new Date(item.time), minutes)
			}
		})
		fs.writeFileSync("reservations.json", JSON.stringify(all_reserv))
		all_reserv.sort(function(a,b){
			return new Date(a.time)-new Date(b.time)
		})
		return all_reserv.filter(item => item.restaurant === restaurant)
	}
	catch(error){
		console.log(error)
	}
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}

