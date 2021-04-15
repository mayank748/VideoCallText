import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
// import { Loader, LoaderOptions } from 'google-maps';
import React from 'react';
import { isElementOfType } from 'react-dom/cjs/react-dom-test-utils.production.min';
const mapStyles = {
    maxWidth: '560px',
    height: '80vh',
    width: '100%'
};


class MapComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cordinate: {},
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        }
    }
    componentDidMount() {
        this.DragedPosition = this.DragedPosition.bind(this);
        this.FetchAddress = this.FetchAddress.bind(this);
        this.MarkerLocation = this.MarkerLocation.bind(this);
    }
    LocationError = (error) => {
        console.log(error);
    }
    async MarkerLocation() {
        const options = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000
        };
        await navigator.geolocation.getCurrentPosition((cordinate) => {
            console.log('cordinate', cordinate);
            this.setState({
                cordinate: cordinate.coords
            })
            // setCordinates(cordinate.coords);
            this.FetchAddress(Number(cordinate.coords.latitude), Number(cordinate.coords.longitude));
        }, this.LocationError, options)
    }
    async DragedPosition(mapData, map, marker) {
        console.log('marker', marker);
        console.log('map', map.position.toString())
        console.log('map item', mapData)
        var newposition = map.position.toString().replace(/[()]/g, ' ').split(',');
        newposition = newposition.map(function (el) {
            return el.trim();
        });
        console.log('newposition', Number(newposition[0]))
        console.log('newposition', Number(newposition[1]))

        this.FetchAddress(newposition[0], newposition[1]);
    }

    GetAddressLocation = async () => {
        var flatno = document.getElementById('flatno')
        var street_number = document.getElementById('street_number')
        var pincode = document.getElementById('pincode')
        var district = document.getElementById('district')
        var state = document.getElementById('state')
        var country = document.getElementById('country')
        var landMark = document.getElementById('landMark')
        var Sub_distric = document.getElementById('Sub_distric');
        console.log('flatno value', flatno.value)
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=` + flatno.value + `,` + street_number.value + `,` + landMark.value + `,` + Sub_distric.value + `,` + district.value + `,` + state.value + `,` + pincode.value + `,` + country.value + `&key=AIzaSyDRSaTuGliBUAy-X979oIkLHGsJ6XD7jPM`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('result', result);
                    console.log('result lat long', result.results)
                    console.log('result.results[0].geometry.location', result.results[0].geometry.location)
                    this.setState({
                        cordinate: {
                            longitude: result.results[0].geometry.location.lng,
                            latitude: result.results[0].geometry.location.lat
                        }
                    })
                    this.FetchAddress(result.results[0].geometry.location.lat.toString(), result.results[0].geometry.location.lng.toString())
                },
                (error) => {
                    console.log('error', error)
                }
            )
    }

    async FetchAddress(lat, lng) {
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=` + Number(lat) + `,` + Number(lng) + `&key=AIzaSyDRSaTuGliBUAy-X979oIkLHGsJ6XD7jPM`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('result', result);
                    console.log('result address', result.results)
                },
                (error) => {
                    console.log('error', error)
                }
            )
    }
    getAddressByLatLng = async () => {
        var latlng = document.getElementById('latlng');
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=` + latlng.value + `&key=AIzaSyDRSaTuGliBUAy-X979oIkLHGsJ6XD7jPM`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('result', result);
                    console.log('result address', result.results)
                    var actualData = []
                    var datMaxlength = 0;
                    result.results.forEach(element => {
                        if (datMaxlength == 0) {
                            datMaxlength = element.address_components.length;
                            actualData = element.address_components;
                        } else {
                            if (datMaxlength < element.address_components.length) {
                                datMaxlength = element.address_components.length
                                actualData = element.address_components;
                            }
                        }
                    });
                    console.log('actual data', actualData);
                },
                (error) => {
                    console.log('error', error)
                }
            )
    }

    render() {
        const { cordinate } = this.state;
        const latlangCenter = { lat: -6.210911, lng: 106.818411 }
        return (
            <div>
                <button onClick={this.MarkerLocation}>Current location</button>
                <input id="flatno" placeholder="Flat. No" />
                <input id="street_number" placeholder="street_number" />
                <input id="landMark" placeholder="landMark" />
                <input id="Sub_distric" placeholder="Sub District" />
                <input id="district" placeholder="District" />
                <input id="state" placeholder="State" />
                <input id="pincode" placeholder="Pincode" />
                <input id="country" placeholder="country" />
                <input id='latlng' placeholder='latlng' />
                <button onClick={this.GetAddressLocation}>Get Location</button>
                <button onClick={this.getAddressByLatLng}>getAddressByLatLng</button>
                <Map google={this.props.google} zoom={15} initialCenter={latlangCenter}
                    center={{ lat: Number(cordinate.latitude), lng: Number(cordinate.longitude) }}
                    style={mapStyles}
                >
                    <Marker
                        name={'Current location'}
                        position={{ lat: Number(cordinate.latitude), lng: Number(cordinate.longitude) }}
                        clickable={true}
                        onDragend={this.DragedPosition}
                        draggable={true}
                    />
                </Map>
            </div>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyDLSwm-otg8-bg4tEmotFCTcUcwOWvkcwM'
})(MapComponent);
// export default MapComponent;