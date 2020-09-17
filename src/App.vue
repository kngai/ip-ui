<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawerLeft"
      app
      clipped>
      <v-list dense>
        <v-list-item link router to="/">
          <v-list-item-action>
            <v-icon>mdi-map</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Map</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router to="about">
          <v-list-item-action>
            <v-icon>mdi-help-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group no-action
          prepend-icon="mdi-translate">
          <template v-slot:activator>
            <v-list-item-title>Language</v-list-item-title>
          </template>
          <v-list-item>
            <v-radio-group v-model="$i18n.locale">
              <v-radio
                v-for="(name, lang) in supportedLocales"
                :key="lang"
                :label="name"
                :value="lang" />
            </v-radio-group>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      id="elements-drawer"
      v-model="drawerRight"
      hide-overlay
      app
      right
      clipped
      width="500px">
      <p>Right drawer here</p>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      clipped-right>
      <v-app-bar-nav-icon @click.stop="drawerLeft = !drawerLeft"></v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ $t('common.appName') }} <v-chip color="success">{{ $i18n.locale }}</v-chip>
        ({{ version }} - {{ build_date }})
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon>
    </v-app-bar>

    <!-- START OF temporary drawers -->
    <!-- END OF temporary drawers -->

    <v-main
      id="app-content">
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawerRight: false,
      drawerLeft: false,
      version: process.env.VUE_APP_VERSION,
      build_date: process.env.VUE_APP_BUILD_DATE,
      supportedLocales: {
        en: 'English',
        fr: 'Français'
      }
    }
  }
}
</script>

<style>
/* draggable-header mouse styling for v-dialogs */
.v-dialog.v-dialog--active .draggable-header {
  cursor: grab;
}
.v-dialog.v-dialog--active .draggable-header:active {
  cursor: grabbing;
}
</style>
