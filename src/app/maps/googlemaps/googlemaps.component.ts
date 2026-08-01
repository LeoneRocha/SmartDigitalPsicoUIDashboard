import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'vector-maps-cmp',
    templateUrl: './googlemaps.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GoogleMapsComponent {
    center: google.maps.LatLngLiteral = { lat: 40.748817, lng: -73.985428 };
    mapOptions: google.maps.MapOptions = { scrollwheel: false };
}
