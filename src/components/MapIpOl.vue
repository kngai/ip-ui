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

      <vl-layer-vector :z-index="2" :visible="climateStationsOn">
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
              v-model="climateStationsOn"
              :label="`Climate stations: ${climateStationsOn}`">
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
      climateStations: {
        features: []
      },
      climateStationsOn: true,
      geoJSONClimate: new GeoJSON()
    }
  },
  mounted() {
    this.loadClimateStations()
  },
  computed: {
    ...mapGetters('oa', [
      'collectionIds',
      'conformsTo'
    ]),
    ...mapGetters('oaGeomet', {
      geometCollectionItemsById: 'collectionItemsById'
    }),
    numClimateStations: function () {
      if (Object.prototype.hasOwnProperty.call(this.climateStations, 'features')) {
        return this.climateStations.features.length
      } else {
        return 0
      }
    },
    featuresClimateStations: function () {
      return this.climateStations.features
    }
  },
  methods: {
    ...mapActions('oa', [
      'fetchAllCollections',
      'fetchConformance'
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
      await this.fetchGeometCollectionItems({
        collectionId: 'climate-stations'
      })
      this.climateStations = this.geometCollectionItemsById('climate-stations')
    },
    // styleFactoryClimateStation: function() {
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
