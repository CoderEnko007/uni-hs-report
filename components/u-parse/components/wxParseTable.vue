<template>
  <rich-text :nodes="nodes"></rich-text>
</template>

<script>
  export default {
    name: 'wxParseTable',
    props: {
      node: {
        type: Object,
        default () {
          return {};
        },
      },
    },
    data() {
      return {
        nodes: []
      };
    },
    mounted() {
      console.log('table loadNode', this.node)
      this.nodes = this.loadNode([this.node]);
      console.log('loadNode end', this.nodes)
    },
    methods: {
      loadNode(node) {
        let obj = [];
        let td_node = node.filter(v=>{
          return v.tag == 'td'
        })
        for (let td of td_node) {
          td['attr']['width'] = uni.upx2px(690/td_node.length)
        }
        for (let children of node) {
          console.log(children)
          if (children.node == 'element') {
            let attrs = {}
            if (children.tag == 'img') {
              let width = uni.upx2px(345)
              attrs = {
                class: children.classStr,
                src: children.attr.src,
                width: '100%'
              }
            } else {
              attrs = {
                class: children.classStr,
                // style: children.styleStr,
              }
            }
            let t = {
              name: children.tag,
              attrs: attrs,
              children: children.nodes ? this.loadNode(children.nodes) : []
            }
            obj.push(t)
          } else if (children.node == 'text') {
            obj.push({
              type: 'text',
              text: children.text
            })
          }
        }
        return obj
      }
    }
  };
</script>
<style lang="scss">
.table {
  border-collapse: collapse;
  box-sizing: border-box;
  /* 内边框 */
  border: 1px solid #dadada;
  width: 100%;
  word-break: break-all;
}

.tbody {
  border-collapse: collapse;
  box-sizing: border-box;
  /* 内边框 */
  border: 1px solid #dadada;
}

.thead,
.tfoot,
.th {
  border-collapse: collapse;
  box-sizing: border-box;
  background: #ececec;
  font-weight: 40;
}

.tr {
  border-collapse: collapse;
  box-sizing: border-box;
  /* border: 2px solid #F0AD4E; */
  overflow: auto;
}

.th,
.td {
  border-collapse: collapse;
  box-sizing: border-box;
  border: 2upx solid #dadada;
  overflow: auto;
  word-break: break-all;
  padding: 10upx;
}
</style>
