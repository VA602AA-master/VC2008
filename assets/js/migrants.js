

function app(){

	var svg;
	var map = MapWithLayers();
	var migrants;

	function me(selection){

		console.log('seelction',selection.node());

		// Creation of the containing SVG element for the map
		//
		svg = selection.append("svg")
			.attr('height',500)
			.attr('width',"100%");

		// loading geographical data
		d3.json("assets/data/migrant.json")
		.then(function (json){
			console.log("raw data", json);
			migrants = json.map(function(d,i){
				var r =  {
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

			console.log("migrants", migrants);



			// transform reports to a FeatureCollection
			var fcReports = {
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
			var extentX = d3.extent(migrants, function(d){return d.EncounterCoords[0]});
			var extentY = d3.extent(migrants, function(d){return d.EncounterCoords[1]});
			console.log("extentX", extentX);
			console.log("extentY", extentY);
			var centroid = [(extentX[0]+extentX[1])/2,(extentY[0]+extentY[1])/2];
			console.log("centroid", centroid);

			map.center(centroid)
				.scale(3000);


				console.log('svg',svg);
				var gReports = svg.append("g")
					.attr("class","reports")
					.datum(fcReports)
				.call(map);

		});


	}




	return me;
}



var myApp = app();
d3.select("#viz")
.call(myApp);
