import { Component } from '@angular/core';

@Component({
    selector: 'fullscreen-map-cmp',
    templateUrl: 'fullscreenmap.component.html',
    standalone: false
})
export class FullScreenMapsComponent {
    center: google.maps.LatLngLiteral = { lat: 40.748817, lng: -73.985428 };
    mapOptions: google.maps.MapOptions = { scrollwheel: false };
}
