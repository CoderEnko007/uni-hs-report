<template>
<div class="container">
  <!-- / 1 -->
  <section v-if="mode==='sk-rotating-plane'">
    <div class='block sk-rotating-plane'></div>
  </section>
  <!-- / 3 -->
  <section v-else-if="mode==='sk-wave'">
    <div class='block sk-wave'>
      <div class='sk-rect sk-rect-1'></div>
      <div class='sk-rect sk-rect-2'></div>
      <div class='sk-rect sk-rect-3'></div>
      <div class='sk-rect sk-rect-4'></div>
      <div class='sk-rect sk-rect-5'></div>
    </div>
  </section>
  <!-- / 4 -->
  <section v-else-if="mode==='sk-wandering-cubes'">
    <div class='block sk-wandering-cubes'>
      <div class='sk-cube sk-cube-1'></div>
      <div class='sk-cube sk-cube-2'></div>
    </div>
  </section>
  <!-- / 5 -->
  <section v-else-if="mode==='sk-spinner-pulse'">
    <div class='block sk-spinner sk-spinner-pulse'></div>
  </section>
  <!-- / 6 -->
  <section v-else-if="mode==='sk-chasing-dots'">
    <div class='block sk-chasing-dots'>
      <div class='sk-child sk-dot-1'></div>
      <div class='sk-child sk-dot-2'></div>
    </div>
  </section>
  <!-- / 7 -->
  <section v-else-if="mode==='sk-three-bounce'">
    <div class='block sk-three-bounce'>
      <div class='sk-bounce-1 sk-child'></div>
      <div class='sk-bounce-2 sk-child'></div>
      <div class='sk-bounce-3 sk-child'></div>
    </div>
  </section>
  <!-- / 8 -->
  <section v-else-if="mode==='sk-circle-bounce'">
    <div class='block sk-circle-bounce' :style="{width: size==='small'?2+'em':4+'em', height: size==='small'?2+'em':4+'em'}">
      <div class='sk-child sk-circle-1'></div>
      <div class='sk-child sk-circle-2'></div>
      <div class='sk-child sk-circle-3'></div>
      <div class='sk-child sk-circle-4'></div>
      <div class='sk-child sk-circle-5'></div>
      <div class='sk-child sk-circle-6'></div>
      <div class='sk-child sk-circle-7'></div>
      <div class='sk-child sk-circle-8'></div>
      <div class='sk-child sk-circle-9'></div>
      <div class='sk-child sk-circle-10'></div>
      <div class='sk-child sk-circle-11'></div>
      <div class='sk-child sk-circle-12'></div>
    </div>
  </section>
  <!-- / 9 -->
  <section v-else-if="mode==='sk-cube-grid'">
    <div class='block sk-cube-grid'>
      <div class='sk-cube sk-cube-1'></div>
      <div class='sk-cube sk-cube-2'></div>
      <div class='sk-cube sk-cube-3'></div>
      <div class='sk-cube sk-cube-4'></div>
      <div class='sk-cube sk-cube-5'></div>
      <div class='sk-cube sk-cube-6'></div>
      <div class='sk-cube sk-cube-7'></div>
      <div class='sk-cube sk-cube-8'></div>
      <div class='sk-cube sk-cube-9'></div>
    </div>
  </section>
  <!-- / 10 -->
  <section v-else-if="mode==='sk-fading-circle'">
    <div class='block sk-fading-circle'>
      <div class='sk-circle sk-circle-1'></div>
      <div class='sk-circle sk-circle-2'></div>
      <div class='sk-circle sk-circle-3'></div>
      <div class='sk-circle sk-circle-4'></div>
      <div class='sk-circle sk-circle-5'></div>
      <div class='sk-circle sk-circle-6'></div>
      <div class='sk-circle sk-circle-7'></div>
      <div class='sk-circle sk-circle-8'></div>
      <div class='sk-circle sk-circle-9'></div>
      <div class='sk-circle sk-circle-10'></div>
      <div class='sk-circle sk-circle-11'></div>
      <div class='sk-circle sk-circle-12'></div>
    </div>
  </section>
  <!-- / 11 -->
  <section v-else-if="mode==='sk-folding-cube'">
    <div class='block sk-folding-cube'>
      <div class='sk-cube sk-cube-1'></div>
      <div class='sk-cube sk-cube-2'></div>
      <div class='sk-cube sk-cube-4'></div>
      <div class='sk-cube sk-cube-3'></div>
    </div>
  </section>
  <!-- / 2 -->
  <section v-else>
    <div class='block sk-double-bounce'>
      <div class='sk-child sk-double-bounce-1'></div>
      <div class='sk-child sk-double-bounce-2'></div>
    </div>
  </section>
</div>
</template>
<script>
export default {
  name: 'SpinKit',
  props: ['mode', 'size'],
}
</script>
<style lang="scss" scoped>
$spinkit-size: 2em !default;
$spinkit-spinner-color: #337ab7 !default;
.container {
	position: absolute;
}
section {
  position:relative;
  height:100%;
}
.block {
  position:absolute !important;
  left:0;
  right:0;
  top:0;
  bottom:0;
}
// 1
.sk-rotating-plane {
  width: $spinkit-size;
  height: $spinkit-size;
  margin: auto;
  background-color: $spinkit-spinner-color;
  animation: sk-rotating-plane 1.2s infinite ease-in-out;
}

@keyframes sk-rotating-plane {
  0% {
    transform: perspective(240rpx) rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: perspective(240rpx) rotateX(-180.1deg) rotateY(0deg);
  }
  100% {
    transform: perspective(240rpx) rotateX(-180deg) rotateY(-179.9deg);
  }
}

// 2
.sk-double-bounce {
  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;

  .sk-child {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: $spinkit-spinner-color;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    animation: sk-double-bounce 2.0s infinite ease-in-out;
  }

  .sk-double-bounce-2 {
    animation-delay: -1.0s;
  }
}

@keyframes sk-double-bounce {
  0%, 100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.0);
  }
}

// 3
.sk-wave {
  $rectCount: 5;
  $animationDuration: 1.2s;
  $delayRange: 0.4s;

  width: $spinkit-size * 1.5;
  height: $spinkit-size;
  margin: auto;
  text-align: center;
  font-size: 1em;

  .sk-rect {
    background-color: $spinkit-spinner-color;
    height: 100%;
    width: .5em;
    display: inline-block;
    animation: sk-wave-stretch-delay $animationDuration infinite ease-in-out;
  }

  @for $i from 1 through $rectCount {
    .sk-rect-#{$i} { animation-delay: - $animationDuration + $delayRange / ($rectCount - 1) * ($i - 1); }
  }
}

@keyframes sk-wave-stretch-delay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1.0);
  }
}

// 4
.sk-wandering-cubes {
  $animationDuration: 1.8s;

  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;

  .sk-cube {
    background-color: $spinkit-spinner-color;
    width: ($spinkit-size / 4);
    height: ($spinkit-size / 4);
    position: absolute;
    top: 0;
    left: 0;
    animation: sk-wandering-cubes $animationDuration ease-in-out #{-$animationDuration} infinite both;
  }

  .sk-cube-2 {
    animation-delay: (-$animationDuration / 2);
  }
}

@keyframes sk-wandering-cubes {
  $cubeDistance: ($spinkit-size / 2);
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: translateX($cubeDistance) rotate(-90deg) scale(0.5);
  }
  50% {
    /* Hack to make FF rotate in the right direction */
    transform: translateX($cubeDistance) translateY($cubeDistance) rotate(-179deg);
  }
  50.1% {
    transform: translateX($cubeDistance) translateY($cubeDistance) rotate(-180deg);
  }
  75% {
    transform: translateX(0) translateY($cubeDistance) rotate(-270deg) scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
  }
}

// 5
.sk-spinner-pulse {
  width: 2em;
  height: 2em;
  margin: auto;
  background-color: $spinkit-spinner-color;
  border-radius: 100%;
  animation: sk-spinner-pulse 1.0s infinite ease-in-out;
}

@keyframes sk-spinner-pulse {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1.0);
    opacity: 0;
  }
}

// 6
.sk-chasing-dots {
  $animationDuration: 2.0s;

  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;
  text-align: center;
  animation: sk-chasing-dots-rotate $animationDuration infinite linear;

  .sk-child {
    width: ($spinkit-size / 2);
    height: ($spinkit-size / 2);
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: $spinkit-spinner-color;
    border-radius: 100%;
    animation: sk-chasing-dots-bounce $animationDuration infinite ease-in-out;
  }

  .sk-dot-2 {
    top: auto;
    bottom: 0;
    animation-delay: (-$animationDuration / 2);
  }
}

@keyframes sk-chasing-dots-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chasing-dots-bounce {
  0%, 100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.0);
  }
}

// 7
.sk-three-bounce {
  $animationDuration: 1.4s;
  $delayRange: 0.32s;
  width: ($spinkit-size * 2);
  margin: auto;
  text-align: center;

  .sk-child {
    width: ($spinkit-size / 2);
    height: ($spinkit-size / 2);
    background-color: $spinkit-spinner-color;

    border-radius: 100%;
    display: inline-block;
    animation: sk-three-bounce $animationDuration ease-in-out 0s infinite both;
  }

  .sk-bounce-1 {
    animation-delay: -$delayRange;
  }
  .sk-bounce-2 {
    animation-delay: (-$delayRange / 2);
  }
}

@keyframes sk-three-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}

// 8
.sk-circle-bounce {
  $circleCount: 12;
  $animationDuration: 1.2s;

  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;

  .sk-child {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-child:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: $spinkit-spinner-color;
    border-radius: 100%;
    animation: sk-circle-bounce-delay $animationDuration infinite ease-in-out both;
  }

  @for $i from 2 through $circleCount {
    .sk-circle-#{$i} {
      transform: rotate((360deg / $circleCount * ($i - 1)));
    }
  }

  @for $i from 2 through $circleCount {
    .sk-circle-#{$i}:before {
      animation-delay: (-$animationDuration + $animationDuration / $circleCount * ($i - 1));
    }
  }
}

@keyframes sk-circle-bounce-delay {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}

// 9
.sk-cube-grid {
  $delayRange: 0.4s;

  width: $spinkit-size;
  height: $spinkit-size;
  margin: auto;

  .sk-cube {
    width: 33%;
    height: 33%;
    background-color: $spinkit-spinner-color;
    float: left;
    animation: sk-cube-grid-scale-delay 1.3s infinite ease-in-out;
  }

  /*
   * Spinner positions
   * 1 2 3
   * 4 5 6
   * 7 8 9
   */

  .sk-cube-1 {
    animation-delay: ($delayRange * 0.50);
  }
  .sk-cube-2 {
    animation-delay: ($delayRange * 0.75);
  }
  .sk-cube-3 {
    animation-delay: $delayRange;
  }
  .sk-cube-4 {
    animation-delay: ($delayRange * 0.25);
  }
  .sk-cube-5 {
    animation-delay: ($delayRange * 0.50);
  }
  .sk-cube-6 {
    animation-delay: ($delayRange * 0.75);
  }
  .sk-cube-7 {
    animation-delay: 0s;
  }
  .sk-cube-8 {
    animation-delay: ($delayRange * 0.25);
  }
  .sk-cube-9 {
    animation-delay: ($delayRange * 0.50);
  }
}

@keyframes sk-cube-grid-scale-delay {
  0%, 70%, 100% {
    transform: scale3D(1,1,1);
  }
  35%           {
    transform: scale3D(0,0,1);
  }
}

// 10
.sk-fading-circle {
  $circleCount: 12;
  $animationDuration: 1.2s;

  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;

  .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-circle:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: $spinkit-spinner-color;
    border-radius: 100%;
    animation: sk-fading-circle-delay $animationDuration infinite ease-in-out both;
  }

  @for $i from 2 through $circleCount {
    .sk-circle-#{$i} {
      transform: rotate((360deg / $circleCount * ($i - 1)));
    }
  }

  @for $i from 2 through $circleCount {
    .sk-circle-#{$i}:before {
      animation-delay: (-$animationDuration + $animationDuration / $circleCount * ($i - 1));
    }
  }

}

@keyframes sk-fading-circle-delay {
  0%, 39%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

// 11
.sk-folding-cube {
  $cubeCount: 4;
  $animationDuration: 2.4s;
  $delayRange: ($animationDuration / 2);

  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;
  transform: rotateZ(45deg);

  .sk-cube {
    float: left;
    width: 50%;
    height: 50%;
    position: relative;
    transform: scale(1.1);
  }

  .sk-cube:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $spinkit-spinner-color;
    animation: sk-folding-cube-angle $animationDuration infinite linear both;
    transform-origin: 100% 100%;
  }

  // Rotation / angle
  @for $i from 2 through $cubeCount {
    .sk-cube-#{$i} {
      transform: scale(1.1) rotateZ((90deg * ($i - 1)));
    }
  }

  @for $i from 2 through $cubeCount {
    .sk-cube-#{$i}:before {
      animation-delay: ($delayRange / $cubeCount * ($i - 1));
    }
  }
}

@keyframes sk-folding-cube-angle {
  0%, 10% {
    transform: perspective(280rpx) rotateX(-180deg);
    opacity: 0;
  }
  25%, 75% {
    transform: perspective(280rpx) rotateX(0deg);
    opacity: 1;
  }
  90%, 100% {
    transform: perspective(280rpx) rotateY(180deg);
    opacity: 0;
  }
}
</style>
