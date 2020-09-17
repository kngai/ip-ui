<template>
  <div id="mapContainer">
    <vl-map class="ipMap" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>

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

      <vl-layer-vector :z-index="2">
        <vl-source-vector :features.sync="drawPoint" ident="draw-point"></vl-source-vector>

        <vl-style>
          <vl-style-stroke color="green"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
          <vl-style-circle :radius="5">
            <vl-style-fill color="green"></vl-style-fill>
            <vl-style-stroke color="dark-green"></vl-style-stroke>
          </vl-style-circle>
        </vl-style>
      </vl-layer-vector>

      <vl-interaction-draw :type="drawType" source="draw-source" @drawstart="clearDrawFeatures" v-if="!toggleDrawPoint">
        <vl-style>
          <vl-style-stroke color="blue"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
        </vl-style>
      </vl-interaction-draw>

      <vl-interaction-draw type="Point" source="draw-point" @change="clearDrawPoint" v-if="toggleDrawPoint">
        <vl-style>
          <vl-style-circle :radius="5">
            <vl-style-fill color="white"></vl-style-fill>
            <vl-style-stroke color="red"></vl-style-stroke>
          </vl-style-circle>
        </vl-style>
      </vl-interaction-draw>
    </vl-map>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Debugging</v-card-title>
          <v-card-text>
            Zoom: {{ zoom }}<br>
            Center: {{ center }}<br>
            Rotation: {{ rotation }}<br>
            My geolocation: {{ geolocPosition }}<br>
            Draw Features: {{ drawFeatures }}<br>
            Draw Point: {{ drawPoint }}<br>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Draw Options</v-card-title>
          <v-card-text>
            <v-select
              :items="drawTypes"
              v-model="drawType"
              label="Draw Type"
              dense
            ></v-select>
            <v-switch
              disabled
              v-model="toggleDrawPoint"
              :label="`Switch drawing mode: ${toggleDrawPoint}`"
            ></v-switch>
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
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>OGC API - Conformance</v-card-title>
          <v-card-text>
            <code>{{ conformsTo }}</code>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="loadConformance" color="primary">Fetch</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import 'vuelayers/dist/vuelayers.min.css' // needs css-loader
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MapIpOl',
  data () {
    return {
      zoom: 4,
      center: [-92.93, 59.32],
      rotation: 0,
      geolocPosition: undefined,
      drawFeatures: [],
      drawPoint: [],
      toggleDrawPoint: false,
      drawType: 'Polygon',
      drawTypes: ['Polygon', 'LineString', 'Point']
    }
  },
  computed: {
    ...mapGetters('oa', [
      'collectionIds',
      'conformsTo'
    ])
  },
  methods: {
    ...mapActions('oa', [
      'fetchAllCollections',
      'fetchConformance'
    ]),
    changeLang: function (event, lang) {
      this.$i18n.locale = lang
    },
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
    }
  }
}
</script>

<style scoped>
#mapContainer {
  height: 500px;
  width: 100%;
}
</style>
