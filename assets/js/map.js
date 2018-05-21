
/**
 *
 *  This module will display a map with a symbol encoding for a set of geographical elements
 */


function MapWithLayers(){
	var center = [0,0]; // default value for centering the map

	let map;
	let data;

	function me(selection){
		console.log("MapWithLayers", selection.datum());
		data = selection.datum();
		map = L.map(selection.node()).setView(center.reverse(),6);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		let circleLayer = L.d3SvgOverlay(refreshMap);
		circleLayer.addTo(map);


		// https://leafletjs.com/reference-1.3.0.html#imageoverlay
		// Creating reference to island myApp
		let imageUrl = 'assets/mapIsland.jpg',
    	imageBounds = [ [23.42,-80.52], [24.15,-79.45]];
		L.imageOverlay(imageUrl, imageBounds).addTo(map);


	}

	// getter and setter for variable center
	me.center = function(_){
		if(!arguments.length) return center;
		center = _;
		return me;
	}


refreshMap = function(selection, projection){
	console.log('map datum',data);
	let points = data.features.map(function(f){
		return {
			ll:L.latLng(f.geometry.coordinates.reverse()),
			properties: f.properties,
		}
	})

	var updateSelection = selection.selectAll('circle').data(points);
	updateSelection.enter()
			.append('circle')
			.attr('r',2)
			.attr("cx", function(d) {return projection.latLngToLayerPoint(d.ll).x })
			.attr("cy", function(d) {return projection.latLngToLayerPoint(d.ll).y })
			.classed('interdiction',function(d){return d.properties.RecordType==='Interdiction'})
			.classed('landing',function(d){return d.properties.RecordType==='Landing'})
			.attr('fill',function(d){
				return (d.properties.RecordType==='Interdiction'? 'red':'green')
			})
			.attr('opacity',0.5);
		}


	return me;
}
