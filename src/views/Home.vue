<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <map-ip-ol></map-ip-ol>
  </div>
</template>

<script>
// @ is an alias to /src
import MapIpOl from '@/components/MapIpOl.vue'

export default {
  name: 'Home',
  components: {
    MapIpOl
  }
}
</script>
