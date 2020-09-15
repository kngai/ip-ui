<template>
  <div id="mapContainer">
    <vl-map class="ipMap" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" id="position-feature">
            <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
            <vl-style-box>
              <vl-style-icon src="_media/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
    <div class="debug">
      Zoom: {{ zoom }}<br>
      Center: {{ center }}<br>
      Rotation: {{ rotation }}<br>
      My geolocation: {{ geolocPosition }}
    </div>
  </div>
</template>

<script>
import 'vuelayers/lib/style.css' // needs css-loader

export default {
  name: 'MapIpOl',
  data () {
    return {
      zoom: 2,
      center: [0, 0],
      rotation: 0,
      geolocPosition: undefined
    }
  },
  methods: {
    changeLang: function (event, lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>

<style scoped>
#mapContainer {
  height: 500px;
  width: 100%;
}
.debug {
  padding: 20px;
}
</style>
