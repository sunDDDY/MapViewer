<template>
  <div class="searchBarContainer">
    <div class="wrapper">
      <input
        id="input"
        v-model="input"
        title=""
        type="text"
        class="form-control"
        placeholder="Search Maps"
        @focus="inputFocus = true"
        @blur="inputFocus = false"
      >
      <i class="fas fa-search"></i>
      <ul v-if="!hideSearchRows">
        <li
          v-for="(validRows, index) in searchRows"
          :key="index"
          @click.prevent="updateMap"
          @mouseover="currentListIndex = index"
          @mouseout="currentListIndex = null"
          v-text="validRows.Content"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
    import accessAPI from '../js/api/api-v1'; // import api
    import queryString from 'query-string';

    export default {
        name: "MapSelector",
        props: {
        },
        data() {
            return {
                input: null,
                searchRow: null,
                searchRows: null,
                currentListIndex: null,
                inputFocus: false,
                hideSearchRows: true,
                api: null
            };
        },
        computed: {

        },
        watch: {
            inputFocus: function (stateFocus) {
                this.hideSearchRows = stateFocus === false && this.currentListIndex === null;
                if (this.currentListIndex === null && this.input !== null)
                    this.input = this.searchRow.Content;
            },
            input: async function (input) {
                if(input!==null)
                await this.getSearchRows(input);
            }
        },
        created() {
        },
        async mounted() {
            this.api = await accessAPI();
            this.preload();
        },
        methods: {
            preload: async function () {
                let id = this.getQueryString();
                if (id === undefined) {
                    this.input = '';
                    this.hideSearchRows = false;
                } else {
                    this.searchRow = await this.getSearchRow(id);
                    this.input = this.searchRow.Content;
                    this.$emit('updateImgMapID', this.searchRow.ImgMapID); // emit 1 return MapSelector preload
                }
            },
            getQueryString: function () {
                let id = queryString.parse(location.search);
                return id.ImgMapID;
            },
            getSearchRow: async function (id) {
                return await this.api.getImgMapsSearchRow(id);
            },
            getSearchRows: async function (text) {
                this.searchRows = await this.api.getImgMapsSearchRows(text);
            },
            updateMap: function () {
                let imgMapID = this.searchRows[this.currentListIndex].ImgMapID;
                document.location.href = '/?ImgMapID=' + imgMapID;
            }
        }
    };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .searchBarContainer {
      display: flex;
        position: absolute;
        left: 41%;
        z-index: 2;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    ul li {
        padding: 4px 10px 4px;
        font-size: 1.1em;
        background-color: #E0EDF4;
        border-left: 5px solid #3EB3F6;
        margin-bottom: 2px;
        color: #3E5252;
    }

    li:hover {
        background-color: #8089ff;
        cursor: pointer;
    }

    #input {

        margin-top: 10px;
        width: 346px;
        height: 38px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.04);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 1.1em;
        padding: 10px 12px 8px;
        border-radius: 12px 12px 0 0;
    }
    i[class='fas fa-search'] {
        position: absolute;
        font-size: 1.4em;
        margin-top: -30px;
        margin-left: 300px;
        left: 13px;
        margin-right: 18px;
        color: #6385fe;
    }
    .form-control::placeholder {
        color: #6c757d;
        opacity: 0.6;
    }
</style>
