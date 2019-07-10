<template>
  <div>
    <div class="myButtons">
      <div class="wrapper2">
        <button id="buttonNormalZoom">
          <i class="fas fa-expand"></i>
        </button>
        <button id="createVLayer">
          <i class="far fa-plus-square"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Buttons"
    };
</script>

<style scoped>
  #buttonNormalZoom,
  #createVLayer
  {
    background-color: #e4e3ed; /* Green */
    font-size: 20px;
    color: #000000;
    padding: 2px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-left: 8px;
    outline: none;

  }
  .myButtons {
    position: absolute;
    left: 41%;
    z-index: 1;
  }
  .wrapper2 {
    display: flex;
    position: relative;
    z-index: 1;
    margin-top: 11px;
    margin-left: 370%;
  }
</style>
