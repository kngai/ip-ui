<template>
  <div id="mapContainer">
    <vl-map class="ipMap" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>

      <vl-layer-image v-for="(layerOn, layerName) in geometWmsLayers" :key="layerName" :visible="layerOn">
        <vl-source-image-wms url="https://geo.weather.gc.ca/geomet" format="image/png" :layers="layerName" transition="0"></vl-source-image-wms>
      </vl-layer-image>

      <vl-layer-vector :z-index="1">
        <vl-source-vector :features.sync="drawFeatures" ident="draw-source"></vl-source-vector>

        <vl-style>
          <vl-style-stroke color="green"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
          <vl-style-circle :radius="5">
            <vl-style-fill color="green"></vl-style-fill>
            <vl-style-stroke color="dark-green"></vl-style-stroke>
          </vl-style-circle>
        </vl-style>
      </vl-layer-vector>

      <vl-layer-vector :z-index="2" :visible="climateStations.on">
        <vl-source-vector :features="featuresClimateStations" ident="climate-stations"></vl-source-vector>

        <vl-style>
          <vl-style-stroke color="brown"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
          <vl-style-circle :radius="5">
            <vl-style-fill color="orange"></vl-style-fill>
            <vl-style-stroke color="brown"></vl-style-stroke>
          </vl-style-circle>
          <!-- <vl-style-text :text="'Hola'"></vl-style-text> -->
        </vl-style>
      </vl-layer-vector>

      <vl-interaction-draw :type="drawType" source="draw-source" @drawstart="clearDrawFeatures" v-if="drawOn">
        <vl-style>
          <vl-style-stroke color="blue"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
        </vl-style>
      </vl-interaction-draw>
    </vl-map>

    <h2>Debugging</h2>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>OL Map</v-card-title>
          <v-card-text>
            Zoom: {{ zoom }}<br>
            Center: {{ center }}<br>
            Rotation: {{ rotation }}<br>
            Draw Features: {{ drawFeatures }}<br>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Draw Options</v-card-title>
          <v-card-text>
            <v-switch
              v-model="drawOn"
              :label="`Draw on: ${drawOn}`">
            </v-switch>
            <v-select
              :disabled="!drawOn"
              :items="drawTypes"
              v-model="drawType"
              label="Draw Type"
              dense
            ></v-select>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>OGC API - Processes</v-card-title>
          <v-card-text>
            <code>{{  }}</code>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="loadProcesses" color="primary">Fetch</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>GeoMet WMS Layers</v-card-title>
          <v-card-text>
            <v-switch
              v-for="(layerOn, layerName) in geometWmsLayers" :key="layerName"
              v-model="geometWmsLayers[layerName]"
              :label="`${layerName}: ${layerOn}`">
            </v-switch>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>OGC API - Collections</v-card-title>
          <v-card-text>
            <code>{{ collectionIds }}</code>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="loadAllCollections" color="primary">Fetch</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>OGC API - Conformance</v-card-title>
          <v-card-text>
            <code>{{ conformsTo }}</code>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="loadConformance" color="primary">Fetch</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>GeoJSON layers</v-card-title>
          <v-card-text>
            <v-switch
              v-model="climateStations.on"
              @change="loadClimateStations"
              :loading="climateStations.loading"
              label="MSC Climate stations">
            </v-switch>
            <v-switch
              v-model="swobStations.on"
              @change="loadDmsSwobStations"
              :loading="swobStations.loading"
              label="DMS SWOB stations">
            </v-switch>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>Climate stations</v-card-title>
          <v-card-text>
            numClimateStations: <code>{{ numClimateStations }}</code>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON'
import 'vuelayers/dist/vuelayers.min.css' // needs css-loader
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MapIpOl',
  data () {
    return {
      zoom: 5,
      center: [-92.93, 59.32],
      rotation: 0,
      drawFeatures: [],
      drawOn: false,
      drawType: 'Polygon',
      drawTypes: ['Polygon', 'LineString', 'Point'],
      geometWmsLayers: {
        'RADAR_1KM_RRAI': true,
        'RADAR_COVERAGE_RRAI.INV': true
      },
      geoJSONClimate: new GeoJSON(),
      climateStations: {
        collectionId: 'climate-stations',
        loading: false,
        data: {
          features: []
        },
        on: false
      },
      swobStations: {
        collectionId: 'dms-swob',
        loading: false,
        data: {
          features: []
        },
        on: false
      }
    }
  },
  computed: {
    ...mapGetters('oa', [
      'collectionIds',
      'conformsTo',
      'collectionItemsById'
    ]),
    ...mapGetters('oaGeomet', {
      geometCollectionItemsById: 'collectionItemsById'
    }),
    numClimateStations: function () {
      if (Object.prototype.hasOwnProperty.call(this.climateStations.data, 'features')) {
        return this.climateStations.data.features.length
      } else {
        return 0
      }
    },
    featuresClimateStations: function () {
      return this.climateStations.data.features
    }
  },
  methods: {
    ...mapActions('oa', [
      'fetchAllCollections',
      'fetchConformance',
      'fetchCollectionItems'
    ]),
    ...mapActions('oaproc', [
      'fetchProcessResults',
      'fetchProcesses'
    ]),
    ...mapActions('oaGeomet', {
      fetchGeometCollectionItems: 'fetchCollectionItems'
    }),
    clearDrawFeatures: function () {
      this.drawFeatures = []
    },
    clearDrawPoint: function () {
      if (this.drawPoint.length > 1) {
        this.drawPoint.shift()
      }
    },
    loadConformance: async function () {
      if (this.conformsTo.length === 0) {
        await this.fetchConformance()
      }
    },
    loadAllCollections: async function () {
      if (this.collectionIds.length === 0) {
        await this.fetchAllCollections()
      }
    },
    loadClimateStations: async function () {
      this.climateStations.loading = true
      await this.fetchGeometCollectionItems({
        collectionId: 'climate-stations'
      })
      this.climateStations.data = this.geometCollectionItemsById(this.climateStations.collectionId)
      this.climateStations.loading = false
    },
    loadDmsSwobStations: async function () {
      this.swobStations.loading = true
      // dms-swob
      await this.fetchCollectionItems({
        collectionId: this.swobStations.collectionId
      })
      this.swobStations.data = this.collectionItemsById(this.swobStations.collectionId)
      this.swobStations.loading = false
    },
    loadProcesses: async function() {
      await this.fetchProcesses()
    },
    loadProcessResults: async function() {
      await this.fetchProcessResults('extract-raster', {
        "inputs": [{
          "id": "model",
          "value": "HRDPS"
        }, {
          "id": "forecast_hours_",
          "value": "2020-09-16T02:00:00Z"
        }, {
          "id": "model_run",
          "value": "2020-09-16T00:00:00Z"
        }, {
          "id": "input_geojson",
          "value": {
            "type": "FeatureCollection",
            "crs": {
              "type": "EPSG",
              "properties": {
                "code": 4326,
                "coordinate_order": [1, 0]
              }
            },
            "features": [{
              "type": "Feature",
              "id": "id0",
              "geometry": {
                "type": "Point",
                "coordinates": [
                  [-100.0, 45.0]
                ]
              }
            }]
          }
        }]
      })
    }
    // styleFactoryClimateStation: function() { // custom styling with text
    //   return feature => {
    //     return [new olStyle({
    //       geometry: feature,
    //       text: new olText({
    //         text: feature.STATION_NAME + ` (${feature.STN_ID})`,
    //         overflow: true
    //       }),
    //       circle: new CircleStyle({
    //         radius: 5,
    //         fill: new olFill({
    //           color: 'orange'
    //         }),
    //         stroke: new olStroke({
    //           color: 'brown',
    //           width: 1
    //         })
    //       })
    //     })]
    //   }
    // }
  }
}
</script>

<style scoped>
#mapContainer {
  height: 500px;
  width: 100%;
}
</style>
