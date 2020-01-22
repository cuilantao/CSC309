/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time') 

const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array
function get_ampm(slicestr){
	var ts = slicestr;
	var H = +ts.substr(0, 2);
  	var h = (H % 12) || 12;
  	var ampm = H < 12 ? " AM" : " PM";
  	ts = h + ts.substr(2, 3) + ampm;
  	return ts;
}

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		/* complete */
		console.log(`Added restaurant ${args[0]}`)
		
	} else {
		/* complete */ 
		console.log("Duplicate restaurant not added.")
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);
	let count = 0
	let slicestr = ""
	for (let i = 0; i < args[1].length; i++){
		if(args[1][i] === " "){
			count += 1
		}
		if (count === 3){
			slicestr = args[1].slice(i+1, args[1].length)
			break;
		}
	}
	slicestr = get_ampm(slicestr)
	// Produce output below
	console.log(`Added reservation at ${args[0]} on at ${slicestr}. for ${args[2]} people.`)
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	// Produce output below
	restaurants.forEach(item => {
		console.log(`${item.name}: ${item.description} - ${item.numReservations} active reservations`)	
	});
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurantByName(yargs_argv['restInfo']);
	const name = yargs_argv['restInfo']
	// Produce output below
	restaurants.forEach(item => {
		if (item.name === name){
			console.log(`${item.name}: ${item.description} - ${item.numReservations} active reservations`)
		}
	})
}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	console.log(`Reservations for ${restaurantName}`)
	// Produce output below
	for (let i = 0; i<reservationsForRestaurant.length; i++){
		let date_array = datetime.addHours(new Date(reservationsForRestaurant[i].time),5).toString().split(" ")
		let ampm = get_ampm(date_array[4])
		console.log(`- ${date_array[1]} ${date_array[2]} ${date_array[3]}, ${ampm}., table for ${reservationsForRestaurant[i].people}`)
	}
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	// Produce output below
	console.log(`Reservations in the next hour`)
	for (let i = 0; i<reservationsForRestaurant.length; i++){
		let date_array =new Date(reservationsForRestaurant[i].time).toString().split(" ")
		let ampm = get_ampm(date_array[4])
		console.log(`- ${reservationsForRestaurant[i].restaurant} ${date_array[1]} ${date_array[2]} ${date_array[3]}, ${ampm}., table for ${reservationsForRestaurant[i].people}`)
	}
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	// Produce output below
	if (earliestReservation.length != 0){
		let date_array = new Date(earliestReservation[0].time).toString().split(" ")
		let ampm = get_ampm(date_array[4])
		console.log(`Checked off reservation on ${date_array[1]} ${date_array[2]} ${date_array[3]}, ${ampm}., table for ${earliestReservation[0].people}`)
	}
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	console.log(`Reservations for ${args[0]}:`)
	for (let i = 0; i<resv.length; i++){
		let date_array = new Date(resv[i].time).toString().split(" ")
		let ampm = get_ampm(date_array[4])
		console.log(`- ${date_array[1]} ${date_array[2]} ${date_array[3]}, ${ampm}., table for ${resv[i].people}`)
	}
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()
		console.log(`Number of restaurants: ${status.numRestaurants}`)
		console.log(`Number of total reservations: ${status.totalReservations}`)
		console.log(`Busiest restaurant: ${status.currentBusiestRestaurantName}`)
		let date_array = new Date(status.systemStartTime).toString().split(" ")
		let ampm = get_ampm(date_array[4])
		console.log(`System started at: ${date_array[1]} ${date_array[2]} ${date_array[3]}, ${ampm}.`)
	// Produce output below
}

