import React from 'react';
import {StyleSheet, View} from 'react-native';

import {YaMap, Geocoder, Point, Polyline, Marker} from 'react-native-yamap';

YaMap.init('');
Geocoder.init('');

const pointA: Point = {
  lat: 56.323505,
  lon: 43.943473,
};

const pointB: Point = {
  lat: 56.326438,
  lon: 43.942907,
};

type Route = {
  points: Array<Point>;
  type: string;
};

function App(): React.JSX.Element {
  const mapRef = React.useRef<null | any>(null);
  const [routes, setRoutes] = React.useState<Array<Route>>([]);

  React.useEffect(() => {
    if (pointA && pointB && mapRef.current) {
      mapRef.current.findMasstransitRoutes([pointA, pointB], (evt: any) => {
        const newRout: Array<Route> = [];

        evt.routes[0].sections.forEach((section: any) => {
          const sectionPoints = section.points.map((point: any) => ({
            lat: point.lat,
            lon: point.lon,
          }));

          newRout.push({
            points: sectionPoints,
            type: section.type,
          });
        });

        setRoutes(newRout);
      });
    }
  }, []);

  return (
    <>
      <YaMap
        ref={mapRef}
        userLocationIcon={{
          uri: 'https://www.clipartmax.com/png/middle/180-1801760_pin-png.png',
        }}
        followUser={true}
        initialRegion={{
          lat: 56.32372,
          lon: 43.946138,
          zoom: 12,
          azimuth: 80,
          tilt: 100,
        }}
        style={styles.mapStyle}>
        {routes.map((route, index) => (
          <View key={index}>
            {index === 0 && (
              <Marker
                point={pointA}
                source={require('./assets/images/courier.png')}
              />
            )}

            {index === routes.length - 1 && (
              <Marker
                point={pointB}
                source={require('./assets/images/marker.png')}
              />
            )}

            <Polyline
              gapLength={route.type === 'walk' ? 10 : 0}
              dashLength={route.type === 'walk' ? 20 : 0}
              points={route.points}
              strokeColor={route.type === 'walk' ? '#9F67FB' : '#3CB300'}
              strokeWidth={5}
            />
          </View>
        ))}
      </YaMap>
    </>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1,
  },
});

export default App;
