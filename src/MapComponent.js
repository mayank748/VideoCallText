import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
// import { Loader, LoaderOptions } from 'google-maps';
import React from 'react';
const mapStyles = {
    maxWidth: '560px',
    height: '80vh',
    width:'100%'
};

class MapComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            cordinate: {}
        }
    }
    componentDidMount() {
        this.MarkerLocation();
    }
    MarkerLocation = () => {
        navigator.geolocation.getCurrentPosition((cordinate) => {
            console.log('cordinate', cordinate);
            this.setState({
                cordinate: cordinate.coords
            })
            // setCordinates(cordinate.coords);
            this.FetchAddress(Number(cordinate.coords.latitude),Number(cordinate.coords.longitude));
        })
    }
    async DragedPosition(mapData, map) {
        console.log('map', map.position.toString())
        console.log('map item', mapData)
        var newposition = map.position.toString().replace(/[()]/g, ' ').split(',');
        newposition = newposition.map(function (el) {
            return el.trim();
        });
        console.log('newposition', Number(newposition[0]))
        console.log('newposition', Number(newposition[1]))
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'React POST Request Example' })
        };
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+Number(newposition[0])+','+Number(newposition[1])+'&key=AIzaSyDRSaTuGliBUAy-X979oIkLHGsJ6XD7jPM', requestOptions);
        const data = await response.json();
        console.log('data', data);
    }
    async FetchAddress(lat,lng){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'React POST Request Example' })
        };
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+Number(lat)+','+Number(lng)+'&key=AIzaSyDRSaTuGliBUAy-X979oIkLHGsJ6XD7jPM', requestOptions);
        const data = await response.json();
        console.log('data', data);
    }
    render() {
        const { cordinate } = this.state;
        const latlangCenter = { lat: 20.9734229, lng: 78.6568942 }
        return (
            <div>
                <button onClick={this.MarkerLocation}>Current location</button>
                <Map google={this.props.google} zoom={15} initialCenter={latlangCenter}
                    center={{ lat: cordinate.latitude, lng: cordinate.longitude }}
                    style={mapStyles}
                >
                    <Marker
                        name={'Current location'}
                        position={{ lat: cordinate.latitude, lng: cordinate.longitude }}
                        clickable={true}
                        onDragend={this.DragedPosition}
                        draggable={true}
                    />

                    <InfoWindow>
                        {/* <div>
       <h1>{this.state.selectedPlace.name}</h1>
     </div> */}
                    </InfoWindow>
                </Map>
            </div>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyDLSwm-otg8-bg4tEmotFCTcUcwOWvkcwM'
})(MapComponent);
// export default MapComponent;