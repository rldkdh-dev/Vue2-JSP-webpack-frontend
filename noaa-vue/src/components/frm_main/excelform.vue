<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
      data: function() {
        return {

        };
      },
      mounted: function() {

      },
      methods: {
        fnInit:function(data){
          Axios.post("/poi/excel.do",data,{responseType: "blob",}
          ).then(function(e) {
            const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
            const link = document.createElement("a")
            const date = new Date()
            const yyyy = date.getFullYear()
            const mm = date.getMonth()+1;
            const dd = date.getDate()
            var format = yyyy+(("00"+mm.toString()).slice(-2))+(("00"+dd.toString()).slice(-2));
            link.href = url
            link.download = data.fileName+"_"+format+".xlsx"
            link.click()
            window.URL.revokeObjectURL(url)
          });
        }
      }
    };
</script>