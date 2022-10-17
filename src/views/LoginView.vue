<template>
  <v-main>
  <div class="home">
    <HelloWorld/>
  </div>
</v-main>
</template>

<script>
import HelloWorld from '@/components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
