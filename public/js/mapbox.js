export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamVubmVmZXI4ODgiLCJhIjoiY21oYWp6aDI0MXU4ZTJrb2VnMHkyaDNmbiJ9.pbbLJheEB2crbr8nG45hfw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-96, 37.8],
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat(loc.coordinates).addTo(map);
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.on('load', () => {
    // ✅ Add static green line connecting all tour locations
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: locations.map((loc) => loc.coordinates),
        },
      },
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#55c57a',
        'line-width': 3,
      },
    });

    map.flyTo({
      center: locations[0].coordinates,
      zoom: 8,
      speed: 0.8,
      curve: 1.2,
      essential: true,
    });

    setTimeout(() => {
      map.fitBounds(bounds, {
        padding: { top: 200, bottom: 100, left: 100, right: 100 },
        duration: 2000,
      });
    }, 2500);
  });
};
