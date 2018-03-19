<template>
  <div class="vu-th-resizer" @mousedown="onDown"></div>
</template>

<script>
export default {
  name:'vuThResizer',
  props:["thIndex"],
  //template:'<div class="vu-th-resizer" @mousedown="onDown"></div>',
  data: function(){
   return {
    startX: 0,
    startWidth: 0,
    isDrag: false,
    th: null,
   }
  },
  methods: {
    onUp: function(ev){
      this.isDrag = false;
      ev && $(document).unbind('mousemove', this.onMove);
      ev && $(document).unbind('mouseup', this.onUp);
      ev.stopPropagation();
      this.$emit('th-resized', {
        index: this.thIndex,
        target: this.th,
        changeWidth: (this.th.width() - this.startWidth)
      });
    },
    onMove: function(ev){
        if(this.isDrag){
          this.th.width(this.startWidth+(ev.pageX-this.startX));
          ev.stopPropagation();
        }
    },
    onDown: function(ev){
      ev && ev.preventDefault();
      this.isDrag = true;
      this.th = $(ev.target).closest('.vu-th');
      this.startX = ev.pageX;
      this.startWidth = this.th.width();
      ev && $(document).on('mousemove', this.onMove);
      ev && $(document).on('mouseup', this.onUp);
    }
  }
}
</script>
