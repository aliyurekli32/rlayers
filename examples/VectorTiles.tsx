/*
 * This example illustrates using vector tiles
 * and
 * layers that appear only when zoomed in
 */

import React, {useCallback} from 'react';
import {Feature} from 'ol';
import {fromLonLat} from 'ol/proj';
import {MVT} from 'ol/format';
import 'ol/ol.css';

import {RMap, RLayerTile, RLayerVectorTile} from 'rlayers';
import {useRStyle, RStyle, RStyleArray, RStroke, RFill, RCircle, RText} from 'rlayers/style';
import {Geometry} from 'ol/geom';

const degree = 111319.49079327358;
const fonts = {
    0: {width: 6, font: '1.2rem helvetica,sans-serif'},
    1: {width: 5, font: '0.6rem helvetica,sans-serif'},
    2: {width: 3, font: '0.5rem helvetica,sans-serif'},
    def: {width: 1, font: '0.4rem helvetica,sans-serif'}
};

/*
 * If you know about any open and free to use vector tile services, please let me know
 * This example uses a primitive pbf tile server based on geojson-vt
 * You can use the server set up at https://react-layers.meteo.guru/tiles
 * Or clone the full source code from https://github.com/mmomtchev/geojson-vt-server.git
 */
export default function VectorTiles(): JSX.Element {
    const [country, setCountry] = React.useState('');
    const towns = useRStyle();
    return (
        <React.Fragment>
            <RStyleArray
                ref={towns}
                render={useCallback((feature: Feature<Geometry>) => {
                    /* This is a the towns style
                     *
                     * This examples illustrates superposing two image elements (two circles)
                     *
                     * This is a dynamic style that creates a new object
                     * every time it is access
                     * Use with care
                     */

                    const {width, font} = fonts[feature.get('p')] ?? fonts.def;
                    const color =
                        '#ffff' +
                        feature.get('c').charAt(0).toString('hex').substring(0, 2).padStart(2, '0');
                    return (
                        <React.Fragment>
                            <RStyle zIndex={10}>
                                <RCircle radius={width}>
                                    <RStroke color={'#007bff'} width={width} />
                                    <RFill color={'#007bff'} />
                                </RCircle>
                                <RText font={font} text={feature.get('n')}>
                                    <RStroke color={'#007bff'} width={2} />
                                    <RFill color={color} />
                                </RText>
                            </RStyle>
                            <RStyle zIndex={0}>
                                <RCircle radius={width * 1.5}>
                                    <RStroke color={'#000000'} width={width * 1.5} />
                                    <RFill color={'#000000'} />
                                </RCircle>
                            </RStyle>
                        </React.Fragment>
                    );
                }, [])}
            />
            <RMap className='example-map' initial={{center: fromLonLat([2.364, 48.82]), zoom: 8}}>
                {/* This is the background raster map */}
                <RLayerTile
                    properties={{label: 'Watercolor'}}
                    url='https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
                />
                {/* These are the administrative borders */}
                <RLayerVectorTile
                    onPointerEnter={React.useCallback(
                        (e) =>
                            e.target?.get &&
                            setCountry(e.target.get('n') + ', ' + e.target.get('c')),
                        [setCountry]
                    )}
                    url='https://react-layers.meteo.guru/tiles/admin/{z}/{x}/{y}'
                    format={new MVT()}
                >
                    <RStyle>
                        {/* This is the borders style */}
                        <RStroke color='#007bff' width={2} />
                        <RFill color='transparent' />
                    </RStyle>
                </RLayerVectorTile>
                {/* These are the cities */}
                <RLayerVectorTile
                    url='https://react-layers.meteo.guru/tiles/place/0/{z}/{x}/{y}'
                    maxResolution={0.01 * degree}
                    style={towns}
                    format={new MVT()}
                />
                {/* The towns visible only when zoomed in */}
                <RLayerVectorTile
                    url='https://react-layers.meteo.guru/tiles/place/1/{z}/{x}/{y}'
                    maxResolution={0.0025 * degree}
                    style={towns}
                    format={new MVT()}
                />
                {/* The small villages at maximum resolution */}
                <RLayerVectorTile
                    url='https://react-layers.meteo.guru/tiles/place/2/{z}/{x}/{y}'
                    maxResolution={0.0005 * degree}
                    style={towns}
                    format={new MVT()}
                />
            </RMap>
            <div className='mx-0 mt-0 mb-3 p-1 w-100 jumbotron shadow shadow'>
                <p>
                    You are now in <strong>{country}</strong>
                </p>
            </div>
        </React.Fragment>
    );
}
