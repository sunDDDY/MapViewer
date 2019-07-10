<template>
  <div id="app">
    <MapSelector @updateImgMapID="updateImgMapID"></MapSelector>
    <ImgMap
      v-if="mapID"
      :map-i-d="mapID"
    ></ImgMap>
    <Buttons></Buttons>
  </div>
</template>

<script>
    import MapSelector from './components/mapSelector'; // [components]
    import ImgMap from './components/imgMap';
    import Buttons from './components/toolButtons';

    export default {
        name: 'App',
        components: {
            MapSelector, ImgMap, Buttons
        },
        data() {
            return {
                mapID: null
            };

        },
        computed: {

        },
        asyncComputed: {
        },

        watch: {},

        created() {
        },

        mounted: async function () {
        },
        methods: {
            updateImgMapID(id) {
                this.mapID = id;
            }
        },
    };
</script>

<style>
    #app {
    }

    h1 {
        position: absolute;
        z-index: 100;
    }

    html, body {
        height: 100%;
        margin: 0;
        overflow: hidden;
    }
</style>
