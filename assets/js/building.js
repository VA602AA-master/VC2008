d3.text("assets/data/building_map.txt")
  .then(function(map) {
    let aMap = map.split('\n').map(function(d) {
      return d.trim().split(' ').map(function(e) {
        return +e
      })
    });
    console.log('map', aMap);
    let building = buildingBitmap();

    d3.select("#building").call(building);
    building.data(aMap);

  })
  .catch(function(error) {
    console.log(error);
  });
