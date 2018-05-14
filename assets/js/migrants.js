function app() {

  let svg;
  let map = MapWithLayers(); // component to handle the map
  let migrants; // variable containing all the reports

  // crossfilter data management
  let cf; // crossfilter instance
  let dYear; // dimension for Year
  let dRecordType; // dimension for RecordType
  let dMonth; // dimension for Month
  let dVesselType; // dimension for VesselType



  let colorByReport = d3.scaleOrdinal()
    .domain(["Interdiction", "Landing"])
    .range(["red", "green"]);

  function me(selection) {

    console.log('seelction', selection.node());

    // Creation of the containing SVG element for the map
    //
    svg = selection.append("svg")
      .attr('height', 500)
      .attr('width', "100%");

    // loading geographical data
    d3.json("assets/data/migrant.json")
      .then(function(json) {
        console.log("raw data", json);
        migrants = json.map(function(d, i) {
          let r = {
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
          r['EncounterCoords'] = [+d.EncounterCoords[0], +d.EncounterCoords[1]];
          // if(d.LaunchCoords)
          r['LaunchCoords'] = [+d.LaunchCoords[0], +d.LaunchCoords[1]];
          return r;
        })
        // result of transformation
        console.log("migrants", migrants);

        // initialize Crossfilter
        cf = crossfilter(migrants);
        dYear = cf.dimension(function(d) {
          return d.year
        });
        dRecordType = cf.dimension(function(d) {
          return d.RecordType
        });
        dVesselType = cf.dimension(function(d) {
          return d.VesselType
        });

        // dRecordType.filterAll();
        console.log("years", dYear.group().reduceCount().all());
        console.log("recordType", dRecordType.group().reduceCount().all());
        console.log("vesselType", dVesselType.group().reduceCount().all());

        // select count(*) from migrants where VesselType=="Rustic”
        // dVesselType.filter("Go Fast");
        console.log("num reports (Go Fast)", cf.groupAll().reduceCount());
        // select sum(Passengers) from migrants where VesselType=="Rustic”
        console.log("num passengers (Go Fast)", cf.groupAll().reduceSum(function(d) {
          return d.Passengers
        }).value())
        // select sum(NumDeaths) from migrants where VesselType=="Rustic”
        console.log("num deaths (Go Fast)", cf.groupAll().reduceSum(function(d) {
          return d.NumDeaths
        }))
        // select VesselType, count(*) from migrants group by VesselType
        var countVesselType = dVesselType.group().reduceCount();
        console.log(countVesselType.all());

        // how many report?
        // select count(*) from migrants
        console.log("num reports", cf.groupAll().reduceCount().value());

        // select sum(Passengers) from migrants
        console.log("num passengers", cf.groupAll().reduceSum(function(d) {
          return d.Passengers
        }).value())

        // select sum(NumDeaths) from migrants
        console.log("num deaths", cf.groupAll().reduceSum(function(d) {
          return d.NumDeaths
        }).value())

				createCounters();

        // transform reports to a FeatureCollection
        let fcReports = {
          type: "FeatureCollection",
          features: migrants
            .map(function(d, i) { // for each entry in Museums dictionary
              if (d.EncounterCoords)
                return {
                  type: "Feature",
                  properties: {
                    EncounterDate: d.EncounterDate,
                    NumDeaths: +d.NumDeaths,
                    Passengers: +d.Passengers,
                    RecordNotes: d.RecordNotes,
                    RecordType: d.RecordType,
                    USCG_Vessel: d.USCG_Vessel,
                    VesselType: d.VesselType,
                    year: d.year
                  },
                  geometry: {
                    type: "Point",
                    coordinates: d.EncounterCoords
                  }
                }
            })
        };


        // dynamic computation of centroid
        let extentX = d3.extent(migrants, function(d) {
          return d.EncounterCoords[0]
        });
        let extentY = d3.extent(migrants, function(d) {
          return d.EncounterCoords[1]
        });
        console.log("extentX", extentX);
        console.log("extentY", extentY);
        let centroid = [(extentX[0] + extentX[1]) / 2, (extentY[0] + extentY[1]) / 2];
        console.log("centroid", centroid);

        map.center(centroid)
          .scale(3000);

        let gReports = svg.append("g")
          .attr("class", "reports")
          .datum(fcReports)
          .call(map);

        gReports.selectAll("path")
          .attr('opacity', 0.6)
          .attr('fill', function(d) {
            return colorByReport(d.properties.RecordType)
          })
      });

    let gWorld = svg.append('g')
      .attr('class', 'mapWorld');

    d3.json('assets/data/world.geojson')
      .then(function(world) {
        // removing Antartide since there is a problem with the contour geometry
        world.features = world.features.filter(function(d) {
          return d.properties.CNTR_ID != "AQ"
        });
        gWorld.datum(world)
          .call(map);
      })
  }

	// utility functions
	function createCounters() {
		counterDescriptor = [{
			measure: "# Records",
			cfAggregator: cf.groupAll().reduceCount(),
			classed: "counter-num-records"
		}, {
			measure: "# Passengers",
			cfAggregator: cf.groupAll().reduceSum(function(d) {
				return d.Passengers
			}),
			classed: "counter-Passengers"
		}, {
			measure: "# Deaths",
			cfAggregator: cf.groupAll().reduceSum(function(d) {
				return d.NumDeaths
			}),
			classed: "counter-num-records"
		}]


		counterDescriptor.forEach(function(d) {
			var counter = Counter().measure(d.measure);
			d.counter = counter;
			let cnt = d3.select("#counters")
				.append("div")
				.classed(d.classed, true)
				.classed("col-xs-12", true)
				.datum(d.cfAggregator.value())
				.call(counter);
				console.log('meas', d.cfAggregator.value());
		})
	}


  return me;
}



let myApp = app();
d3.select("#viz")
  .call(myApp);
