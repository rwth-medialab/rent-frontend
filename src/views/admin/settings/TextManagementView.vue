<script lang="ts">
import Editor from "@/components/RichTextEditor.vue";
export default {
  components: { Editor },

  data() {
    return {
      content: "",
    };
  },
};
</script>

<template>
  <v-card>
    <editor v-model="content" />
    <div class="ma-2 content">
      <h3>Content</h3>
      <div class="content" v-html="content"></div>
    </div>
  </v-card>
</template>

<style>
ol,
ul {
  padding-left: 40px !important;
}
</style>
