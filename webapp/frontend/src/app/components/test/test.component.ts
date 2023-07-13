import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements AfterViewInit {

  map!: Leaflet.Map;

  constructor(
    private httpClient: HttpClient
  ) { }

  ngAfterViewInit(): void {
    this.map = Leaflet.map(
      'map',
      {
        center: [51.840688, 6.833137],
        zoom: 11
      }
    );

    Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 25,
        minZoom: 3,
        // attribution: 'Jau man!'
      }
    ).addTo(this.map);

    this.httpClient.get('api/test').subscribe(
      (points: any) => {
        points.forEach((point: any) => {
          Leaflet.marker(
            [point.position.lat, point.position.lon],
          )
            .bindTooltip(`${point.timestamp}`)
            .addTo(this.map);
        });
      }
    );
  }

}
