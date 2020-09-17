<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>Not much information here, other than Chewie is a good boy...</p>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-img src="@/assets/chewie-is-a-good-boy.jpg" width="372" height="496" v-bind="attrs" v-on="on"></v-img>
      </template>
      <span>Chewie</span> <v-icon>mdi-dog</v-icon>
    </v-tooltip>
  </div>
</template>
