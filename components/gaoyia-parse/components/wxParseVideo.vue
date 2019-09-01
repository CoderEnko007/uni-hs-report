<template>
  <!--增加video标签支持，并循环添加-->
  <view :class="node.classStr" :style="node.styleStr">
    <video unit-id="adunit-0f4e12c094385f56" :class="node.classStr" :style="node.styleStr" class="video-video" :src="node.attr.src"></video>
  </view>
</template>

<script>
export default {
  name: 'wxParseVideo',
  props: {
    node: {},
  },
};
</script>
