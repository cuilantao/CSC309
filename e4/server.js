/* E4 server.js */
'use strict';
const log = console.log;

// Express
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Mongo and Mongoose
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')


/// Route for adding restaurant, with *no* reservations (an empty array).
/* 
Request body expects:
{
	"name": <restaurant name>
	"description": <restaurant description>
}
Returned JSON should be the database document added.
*/
// POST /restaurants
app.post('/restaurants', (req, res) => {
	// Add code here
	const name = req.body.name
	const description = req.body.description
	const restaurant = new Restaurant({
		name: name,
		description: description,
		reservations: []
	})
	restaurant.save().then(rest => res.json(rest)).catch(
		error => {
			res.status(400).send(error)
		}
	)

})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here
	Restaurant.find().then(restaurants => {
		res.json(restaurants)
	}).catch(error => res.status(500).send(error))
})


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here
	const rest_id = req.params.id
	if (!ObjectID.isValid(rest_id)){
		res.status(404).send()
	}
	Restaurant.findById(rest_id).then(rest => {
		if (!rest){
			res.status(404).send()
		}
		else{
			res.json(rest)
		}
	}).catch(error => {
		res.status(500).send(error)
	})
})


/// Route for adding reservation to a particular restaurant.
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database 
//   document that the reservation was added to, AND the reservation subdocument:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// POST /restaurants/id
app.post('/restaurants/:id', (req, res) => {
	// Add code here
	const time = req.body.time
	const rest_id = req.params.id
	const people = req.body.people
	if (!ObjectID.isValid(rest_id)){
		res.status(404).send()
	}
	else{
		Restaurant.findById(rest_id).then(
			rest => {
				if (!rest){
					res.status(404).send()
				}
				else{
					const rese = {time: time, people: people}
					rest.reservations.push(rese)
					rest.save().then(restaurant => res.json({reservation:rese, restaurant: rest})).catch(error => res.status(400).send(error))
				}
			}
		).catch(error => res.status(500).send())
	}
})


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/id
app.get('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	const restid = req.params.id
	const resev_id = req.params.resv_id
	if (!ObjectID.isValid(restid)){
		res.status(404).send()
	}
	else if (!ObjectID.isValid(resev_id)){
		res.status(404).send()
	}
	else{
		Restaurant.findById(restid).then(rest => {
			if (!rest){
				res.status(404).send()
			}
			if (rest.reservations.id(resev_id) == null){
				res.status(404).send()
			}
			else{
				res.json(rest.reservations.id(resev_id))
			}
		}).catch(error => {res.status(500).send()})
	}
})


/// Route for deleting reservation
// Returned JSON should have the restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	console.log(req.params.id)
	const restid = req.params.id
	const resev_id = req.params.resv_id
	if (!ObjectID.isValid(restid)){
		res.status(404).send()
	}
	else if (!ObjectID.isValid(resev_id)){
		res.status(404).send()
	}
	else{
		Restaurant.findById(restid).then(rest => {
			const reservation = rest.reservations.id(resev_id)
			reservation.remove()
			rest.save().then(rest => res.json({reservation: reservation, restaurant:rest})).catch(error => res.status(500).send())
		}).catch(error => res.status(400).send())
	}
})


/// Route for changing reservation information
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database
//   document in which the reservation was changed, AND the reservation subdocument changed:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// PATCH restaurant/<restaurant_id>/<reservation_id>
app.patch('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	const restid = req.params.id
	const resev_id = req.params.resv_id
	if (!ObjectID.isValid(restid)){
		res.status(404).send()
	}
	else if (!ObjectID.isValid(resev_id)){
		res.status(404).send()
	}
	else{
		Restaurant.findById(restid).then(rest => {
			let reservation = rest.reservations.id(resev_id)
			reservation.time = req.body.time
			reservation.people = req.body.people
			rest.save().then(restar => {
				res.json({reservation:reservation, restaurant:rest})
			}).catch(error => res.status(400).send(error))
		}).catch(error => res.status(500).send(error))
	}
})


////////// DO NOT CHANGE THE CODE OR PORT NUMBER BELOW
const port = process.env.PORT || 3001
app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
