<script lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import type { TextType } from "@/ts/rent.types";
import { useUserStore } from "@/stores/user";
export default {
  components: { QuillEditor },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      existentTexts: ["frontpage"],
      texts: [] as TextType[],
    };
  },
  async mounted() {
    this.texts = await this.userStore.getFromURLWithAuth({ url: "texts" });
    const toBeCreatedTexts = this.existentTexts.filter(
      (x) => !this.texts.map((y) => y.name).includes(x)
    );
    if (toBeCreatedTexts.length != 0) {
      toBeCreatedTexts.forEach((x) => {
        this.userStore.postURLWithAuth({
          url: "texts",
          params: { content: "", name: x },
        });
      });
      //refresh texts
      this.texts = await this.userStore.getFromURLWithAuth({ url: "texts" });
    }
  },
  methods: {
    submitText(id: number): void {
      console.log(id);
      console.log(this.texts);
      console.log(this.texts.find((text) => (text.id = id)));
      this.userStore.patchURLWithAuth({
        url: "texts/" + String(id),
        params: this.texts.find((text) => (text.id = id)),
      });
    },
  },
};
</script>

<template>
  <v-card class="pa-2">
    <v-expansion-panels>
      <v-expansion-panel v-for="text in texts" :key="text.id">
        <v-expansion-panel-title>
          {{ text.name }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div>
            <QuillEditor
              theme="snow"
              content-type="html"
              v-model:content="text.content"
              toolbar="full"
            />
          </div>
          <v-btn color="secondary" class="mt-2" @click="submitText(text.id)"
            >Speichern</v-btn
          ></v-expansion-panel-text
        >
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <div class="">
      <h3>Content</h3>
      <div class="ql-editor ql-snow" v-html="contentQuill"></div>
    </div> -->
  </v-card>
</template>

<style></style>
