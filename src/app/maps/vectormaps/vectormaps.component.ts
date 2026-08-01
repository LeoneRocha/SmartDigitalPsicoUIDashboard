import { AfterViewInit, Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

declare var $: any;

@Component({
    selector: 'vector-maps-cmp',
    templateUrl: './vectormaps.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class VectorMapsComponent implements AfterViewInit, OnDestroy {
    private mapInitialized = false;

    ngAfterViewInit(): void {
        this.initWorldMapWhenReady();
    }

    ngOnDestroy(): void {
        const $map = $('#worldMap');
        if ($map.length && $map.children('.jvectormap-container').length) {
            $map.empty();
        }
    }

    private initWorldMapWhenReady(attempt = 0): void {
        if (this.mapInitialized) {
            return;
        }

        const $map = $('#worldMap');
        if (!$map.length) {
            return;
        }

        const width = $map.width();
        const height = $map.height();
        if ((!width || !height) && attempt < 20) {
            setTimeout(() => this.initWorldMapWhenReady(attempt + 1), 50);
            return;
        }

        if ($map.children('.jvectormap-container').length) {
            return;
        }

        const mapData = {
            "AU": 760,
            "BR": 550,
            "CA": 120,
            "DE": 1300,
            "FR": 540,
            "GB": 690,
            "GE": 200,
            "IN": 200,
            "RO": 600,
            "RU": 300,
            "US": 2920,
        };

        $map.vectorMap({
            map: 'world_mill_en',
            backgroundColor: "transparent",
            zoomOnScroll: false,
            regionStyle: {
                initial: {
                    fill: '#e4e4e4',
                    "fill-opacity": 0.9,
                    stroke: 'none',
                    "stroke-width": 0,
                    "stroke-opacity": 0
                }
            },
            series: {
                regions: [{
                    values: mapData,
                    scale: ["#AAAAAA", "#444444"],
                    normalizeFunction: 'polynomial'
                }]
            },
        });

        this.mapInitialized = true;
    }
}
