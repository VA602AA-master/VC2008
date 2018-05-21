

function app(){

	let svg;
	let map = MapWithLayers();  // component to handle the map
	let migrants;  // variable containing all the reports

	let colorByReport = d3.scaleOrdinal()
		.domain(["Interdiction","Landing"])
		.range(["red","green"]);

	function me(selection){

		console.log('seelction',selection.node());

		// Creation of the containing SVG element for the map
		//
		// svg = selection.append("svg")
		// 	.attr('height',500)
		// 	.attr('width',"100%");

		// loading geographical data
		d3.json("assets/data/migrant.json")
		.then(function (json){
			console.log("raw data", json);
			migrants = json.map(function(d,i){
				let r =  {
					EncounterDate: d.EncounterDate,
					NumDeaths: +d.NumDeaths,
					Passengers: +d.Passengers,
					RecordNotes: d.RecordNotes,
					RecordType: d.RecordType,
					USCG_Vessel: d.USCG_Vessel,
					VesselType: d.VesselType,
					year: +d.EncounterDate.split('-')[0]
				};
				// if(d.EncounterCoords)
					r['EncounterCoords'] = [+d.EncounterCoords[0],+d.EncounterCoords[1]];
				// if(d.LaunchCoords)
					r['LaunchCoords'] = [+d.LaunchCoords[0],+d.LaunchCoords[1]];
				return r;
			})
			// result of transformation
			console.log("migrants", migrants);

			// transform reports to a FeatureCollection
			let fcReports = {
				type:"FeatureCollection",
				features: migrants
				.map(function(d,i){  // for each entry in Museums dictionary
					if(d.EncounterCoords)
						return {
							type:"Feature",
							properties:{
								EncounterDate: d.EncounterDate,
								NumDeaths: +d.NumDeaths,
								Passengers: +d.Passengers,
								RecordNotes: d.RecordNotes,
								RecordType: d.RecordType,
								USCG_Vessel: d.USCG_Vessel,
								VesselType: d.VesselType,
								year: d.year
							},
							geometry:{
								type:"Point",
								coordinates: d.EncounterCoords
							}
						}
				})
			};


			// dynamic computation of centroid
			let extentX = d3.extent(migrants, function(d){return d.EncounterCoords[0]});
			let extentY = d3.extent(migrants, function(d){return d.EncounterCoords[1]});
			console.log("extentX", extentX);
			console.log("extentY", extentY);
			let centroid = [(extentX[0]+extentX[1])/2,(extentY[0]+extentY[1])/2];
			console.log("centroid", centroid);

			map.center(centroid);

			let gReports = selection
				.style('height','400px')
				.datum(fcReports)
				.call(map);

			// let gReports = svg.append("g")
			// 	.attr("class","reports")
			// 	.datum(fcReports)
			// .call(map);

			gReports.selectAll("path")
				.attr('opacity', 0.6)
				.attr('fill', function(d){return colorByReport(d.properties.RecordType)})

		});


	}




	return me;
}



let myApp = app();
d3.select("#viz")
.call(myApp);
