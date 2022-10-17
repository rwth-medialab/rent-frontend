import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import "vuetify/dist/vuetify.min.css"; 

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi' || 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
      },
});
