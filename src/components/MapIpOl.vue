<template>
  <div>
    <v-row>
      <v-col cols="6">
        <vl-map class="ipMap" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326" @mounted="onMapMounted">
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

          <vl-layer-vector :z-index="1">
            <vl-source-vector :features.sync="drawNearestPoint" ident="draw-nearest-point"></vl-source-vector>

            <vl-style>
              <vl-style-stroke color="green"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="green"></vl-style-fill>
                <vl-style-stroke color="dark-green"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-layer-vector>

          <vl-layer-vector :z-index="2" :visible="geometPointData['climate-stations'].on">
            <vl-source-vector :features="geometPointData['climate-stations'].data.features" ident="climate-stations"></vl-source-vector>

            <vl-style>
              <vl-style-stroke color="brown"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="orange"></vl-style-fill>
                <vl-style-stroke color="brown"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-layer-vector>

          <!-- <vl-layer-vector :z-index="2">
            <vl-source-vector url="/dms-swob-sample.json"></vl-source-vector>

            <vl-style>
              <vl-style-stroke color="brown"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="orange"></vl-style-fill>
                <vl-style-stroke color="blue"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-layer-vector>

          <vl-layer-vector :z-index="2">
            <vl-source-vector url="/climate-station-sample.json"></vl-source-vector>

            <vl-style>
              <vl-style-stroke color="brown"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="orange"></vl-style-fill>
                <vl-style-stroke color="brown"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-layer-vector> -->

          <vl-layer-vector :z-index="3" v-for="(collection, collectionId) in pointData" :key="collectionId" :visible="collection.on">
            <vl-source-vector :features="collection.data.features"></vl-source-vector>

            <vl-style>
              <vl-style-stroke color="brown"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="orange"></vl-style-fill>
                <vl-style-stroke color="brown"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-layer-vector>

          <vl-layer-vector :z-index="4" :visible="stationsBoxed.on">
            <vl-source-vector :features="stationsBoxed.data.features"></vl-source-vector>

            <vl-style>
              <vl-style-stroke color="brown"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="purple"></vl-style-fill>
                <vl-style-stroke color="orange"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-layer-vector>

          <vl-layer-vector :z-index="4" :visible="stationsNearestPoint.on">
            <vl-source-vector :features="stationsNearestPoint.data.features"></vl-source-vector>

            <vl-style>
              <vl-style-stroke color="brown"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="purple"></vl-style-fill>
                <vl-style-stroke color="orange"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-layer-vector>

          <vl-interaction-draw :type="drawType" source="draw-source" @drawend="keepOneDrawFeatures" :active="drawOn">
            <vl-style>
              <vl-style-stroke color="blue"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
            </vl-style>
          </vl-interaction-draw>

          <vl-interaction-draw type="Point" source="draw-nearest-point" @drawend="onDrawEndNearestPoint($event, boxedCollectionId)" :active="stationsNearestPoint.on">
            <vl-style>
              <vl-style-stroke color="blue"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
              <vl-style-circle :radius="5">
                <vl-style-fill color="yellow"></vl-style-fill>
                <vl-style-stroke color="orange"></vl-style-stroke>
              </vl-style-circle>
            </vl-style>
          </vl-interaction-draw>
        </vl-map>
      </v-col>
      <v-col cols="6">
        <v-card :loading="stationsNearestPoint.loading" height="500" class="scrollY">
          <v-card-title>Nearest stations from point</v-card-title>
          <v-card-text>
            <v-switch
              v-model="stationsNearestPoint.on"
              @change="toggleStationNearestPoint"
              :label="'Draw nearest point'">
            </v-switch>
            Lat: {{ coordNearestPoint[1].toFixed(4) }}<br>
            Lon: {{ coordNearestPoint[0].toFixed(4) }}<br>
            <v-text-field label="Distance" v-model="nearestDistance"></v-text-field>
            <v-text-field label="Limit" v-model="nearestLimit" type="number"></v-text-field>
            <v-text-field label="Datetime" v-model="nearestDatetime"></v-text-field>
            <v-select v-model="boxedCollectionId" :items="boxedCollectionIds" label="Collection"></v-select>
            Feature IDs: <code>{{ stationsNearestPoint.data.features.map(feature => feature.id) }}</code>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Map</v-card-title>
          <v-card-text>
            Zoom: {{ zoom }}<br>
            Center: <code>{{ center.map(val => val.toFixed(4)) }}</code><br>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>Draw options</v-card-title>
          <v-card-text>
            <v-switch
              v-model="drawOn"
              @change="toggleDrawFeature"
              :label="`Draw on: ${drawOn}`">
            </v-switch>
            <v-select
              :disabled="!drawOn"
              :items="drawTypes"
              v-model="drawType"
              label="Draw Type"
              dense
            ></v-select>
            Draw Extent: <code>{{ extentDrawFeature }}</code><br>
            Draw Features: <code>{{ drawFeatures }}</code><br>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>GeoMet WMS layers</v-card-title>
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
        <v-card class="scrollY" height="500">
          <v-card-title>Extract raster</v-card-title>
          <v-card-text>
            <v-text-field v-model="processId" label="Process ID"></v-text-field>
            <v-text-field v-for="(val, key) in extractRaster" :key="key" v-model="extractRaster[key]" :label="key"></v-text-field>
            Draw Features: <code>{{ drawFeatures }}</code><br><br>
            <code>{{ rasterExtractResults.data }}</code>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="loadExtractRaster" :loading="rasterExtractResults.loading" color="primary">Fetch results</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>OGC API Processes</v-card-title>
          <v-card-text>
            <code>{{ processes }}</code>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="loadProcesses" color="primary">Fetch</v-btn>
          </v-card-actions>
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
          <v-card-title>Stations in boxed extent</v-card-title>
          <v-card-text>
            <v-switch
              v-model="extentInteractionOn"
              @change="toggleExtentInteraction"
              label="Draw extent (shift + drag)">
            </v-switch>
            <v-select v-model="boxedCollectionId" :items="boxedCollectionIds" label="Collection"></v-select>
            Draw extent: <code>{{ extentInteractionBbox }}</code><br>
            Feature IDs: <code>{{ stationsBoxed.data.features.map(feature => feature.id) }}</code>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="loadCollectionPointsBoxed($event, boxedCollectionId)" color="primary" :disabled="extentDrawFeature === null" :loading="stationsBoxed.loading">Fetch</v-btn>
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
              v-for="(collection, collectionId) in pointData"
              :key="collectionId"
              v-model="collection.on"
              @change="loadCollectionPoints($event, collectionId)"
              :loading="collection.loading"
              :label="collectionId">
            </v-switch>
            <v-switch
              v-model="geometPointData['climate-stations'].on"
              @change="loadGeometCollectionPoints($event, 'climate-stations')"
              :loading="geometPointData['climate-stations'].loading"
              label="climate-stations (GeoMet OPS)">
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
import Polygon from 'ol/geom/Polygon'
import ExtentInteraction from 'ol/interaction/Extent'
import { shiftKeyOnly } from 'ol/events/condition';
import 'vuelayers/dist/vuelayers.min.css' // needs css-loader
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'MapIpOl',
  async mounted () {
    await this.loadAllCollections()
  },
  watch: {
    drawOn: function (newVal) {
      if (newVal) {
        this.stationsNearestPoint.on = false
      }
    }
  },
  data () {
    return {
      zoom: 4,
      center: [-92, 55],
      rotation: 0,
      drawFeatures: [],
      drawNearestPoint: [],
      drawOn: false,
      drawType: 'Point',
      drawTypes: ['Polygon', 'LineString', 'Point'],
      geometWmsLayers: {
        'RADAR_1KM_RRAI': false,
        'RADAR_COVERAGE_RRAI.INV': false
      },
      extentInteraction: new ExtentInteraction({condition: shiftKeyOnly}),
      extentInteractionOn: false,
      extentInteractionBbox: [],
      pointData: {},
      geometPointData: {
        'climate-stations': {
          loading: false,
          data: {
            features: []
          },
          on: false
        }
      },
      rasterExtractResults: {
        loading: false,
        data: {}
      },
      processId: 'hrdps-extract',
      boxedCollectionId: 'dms-swob',
      stationsBoxed: {
        loading: false,
        data: {
          features: []
        },
        on: true
      },
      stationsNearestPoint: {
        loading: false,
        data: {
          features: []
        },
        on: false
      },
      nearestDistance: '500km',
      nearestLimit: 3,
      nearestDatetime: '2020-09-15T00:00:00Z',
      extractRaster: {
        modelRun: '2020-09-16T00:00:00Z',
        forecastHours: '2020-09-16T02:00:00Z',
        model: 'HRDPS'
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
    ...mapState('oaproc', [
      'processes',
      'rasterExtract'
    ]),
    numClimateStations: function () {
      return this.geometPointData['climate-stations'].data.features.length
    },
    extentDrawFeature: function () {
      if (this.drawFeatures.length === 0) {
        return null
      } else {
        let drawPolygon = new Polygon(this.drawFeatures[0].geometry.coordinates, 'XY')
        return drawPolygon.getExtent()
        // return null
      }
    },
    boxedCollectionIds: function () {
      if (this.collectionIds.length === 0) {
        return ['dms-swob']
      }
      return this.collectionIds
    },
    coordNearestPoint: function () {
      if (this.drawNearestPoint.length === 0 ) {
        return [0, 0]
      } else {
        return this.drawNearestPoint[0].geometry.coordinates
      }
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
    onMapMounted: function(vueMap) {
      this.extentInteraction.setActive(this.extentInteractionOn)
      this.extentInteraction.on('extentchanged', () => {
        this.extentInteractionBbox = this.extentInteraction.getExtent()
      })
      vueMap.$map.addInteraction(this.extentInteraction)
    },
    keepOneDrawFeatures: function() {
      if (this.drawFeatures.length > 1) {
        this.drawFeatures.shift()
      }
    },
    keepOneDrawNearestPoint: function() {
      if (this.drawNearestPoint.length > 1) {
        this.drawNearestPoint.shift()
      }
    },
    onDrawEndNearestPoint: function (evt, collectionId) {
      this.keepOneDrawNearestPoint()
      this.loadCollectionPointsNearest(evt, collectionId)
    },
    toggleExtentInteraction: function () {
      this.extentInteraction.setActive(this.extentInteractionOn)
      this.extentInteraction.setExtent(null)
    },
    toggleStationNearestPoint: function () {
      this.stationsNearestPoint.data.features = []
      this.drawNearestPoint = []
    },
    toggleDrawFeature: function () {
      this.drawFeatures = []
    },
    loadConformance: async function() {
      if (this.conformsTo.length === 0) {
        await this.fetchConformance()
      }
    },
    loadAllCollections: async function() {
      if (this.collectionIds.length === 0) {
        await this.fetchAllCollections()
        this.collectionIds.forEach((collectionId) => {
          this.pointData[collectionId] = {
            loading: false,
            data: {
              features: []
            },
            on: false
          }
        })
      }
    },
    loadCollectionPoints: async function(toggleVal, collectionId) {
      if (toggleVal) {
        this.pointData[collectionId].loading = true
        await this.fetchCollectionItems({
          collectionId: collectionId,
          params: {}
        })
        this.pointData[collectionId].data = this.collectionItemsById(collectionId)
        this.pointData[collectionId].loading = false
      }
    },
    loadCollectionPointsBoxed: async function(evt, collectionId) {
      if (this.extentDrawFeature !== null) {
        this.stationsBoxed.loading = true
        await this.fetchCollectionItems({
          collectionId: collectionId,
          params: {
            limit: 5,
            bbox: this.extentDrawFeature.toString()
          }
        })
        this.stationsBoxed.data = this.collectionItemsById(collectionId)
        this.stationsBoxed.loading = false
      }
    },
    loadCollectionPointsNearest: async function(evt, collectionId) {
      if (this.drawNearestPoint.length !== 0) {
        this.stationsNearestPoint.loading = true
        await this.fetchCollectionItems({
          collectionId: collectionId,
          params: {
            limit: this.nearestLimit,
            'geo-distance': this.coordNearestPoint[1].toFixed(4) + ',' + this.coordNearestPoint[0].toFixed(4) + ',' + this.nearestDistance,
            sortby: 'geometry',
            datetime: this.nearestDatetime
          }
        })
        this.stationsNearestPoint.data = this.collectionItemsById(collectionId)
        this.stationsNearestPoint.loading = false
      }
    },
    loadGeometCollectionPoints: async function(toggleVal, collectionId) {
      if (toggleVal) {
        this.geometPointData[collectionId].loading = true
        await this.fetchGeometCollectionItems({
          collectionId: collectionId
        })
        this.geometPointData[collectionId].data = this.geometCollectionItemsById(collectionId)
        this.geometPointData[collectionId].loading = false
      }
    },
    loadProcesses: async function() {
      await this.fetchProcesses()
    },
    loadExtractRaster: async function() {
      this.rasterExtractResults.loading = true
      this.drawFeatures.forEach((feature) => {
        // reduce coordinates to 4 decimals
        if (feature.geometry.type === 'Point') {
          let coords = feature.geometry.coordinates
          feature.geometry.coordinates = [coords.map(xy => xy.toFixed(4))] // array wrap
        }

        // extras
        delete feature.properties
      })
      await this.fetchProcessResults({
        processId: this.processId,
        jsonRequest: {
          "inputs": [{
            "id": "model",
            "value": this.extractRaster.model
          }, {
            "id": "forecast_hours_",
            "value": this.extractRaster.forecastHours
          }, {
            "id": "model_run",
            "value": this.extractRaster.modelRun
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
              "features": this.drawFeatures
              // "features": [{
              //   "type": "Feature",
              //   "id": "id0",
              //   "geometry": {
              //     "type": "Point",
              //     "coordinates": [
              //       [-100.0, 45.0]
              //     ]
              //   }
              // }]
            }
          }]
        }
      })
      this.rasterExtractResults.data = this.rasterExtract
      this.rasterExtractResults.loading = false
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
.ipMap {
  height: 500px;
  width: 100%;
}
.scrollY {
  overflow-y: scroll;
}
</style>
