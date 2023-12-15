// map object to add in coordinates and markers
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// leaflet map 
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)
		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},

	// add business markers
	addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

// get coordinates via geolocation api
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

// get foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
// process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}


// event handlers
// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})


// // create map
// var map = L.map('map').setView([51.505, -0.09], 13);

// // add openstreetmap tiles

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// // create and main add geolocation marker
// const marker = L.marker([48.87007, 2.346453])
// marker.addTo(myMap).bindPopup('<p1><b>The Hoxton, Paris</b></p1>').openPopup()

// // draw the 2nd arrondissement                                        
// var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

// var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);



// // create red pin marker
// const rS = L.marker([48.866200610611926, 2.352236247419453],{icon: redPin}).bindPopup('RÃ©aumur-SÃ©bastopol')

// // metro station markers
// const rS = L.marker([48.866200610611926, 2.352236247419453]).bindPopup('RÃ©aumur-SÃ©bastopol')
// const sSD = L.marker([48.869531786321566, 2.3528590208055196]).bindPopup('Strasbourg-Saint-Denis')
// const sentier = L.marker([48.8673721067762, 2.347107922912739]).bindPopup('Sentier')
// const bourse = L.marker([48.86868503971672, 2.3412285142058167]).bindPopup('Bourse')
// const qS = L.marker([48.869560129483226, 2.3358638645569543]).bindPopup('Quatre Septembre')
// const gB = L.marker([48.871282159004856, 2.3434818588892714]).bindPopup('Grands Boulevards')

// const stations = L.layerGroup([rS, sSD, sentier, bourse, qS, gB]).addTo(myMap)




