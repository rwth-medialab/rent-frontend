<template>
  <v-card class="ma-1">
    <v-dialog v-model="linkEditDialog.open">
      <v-card
        ><div class="ma-2">
          <v-card-title> Link Einfügen </v-card-title>
          <v-text-field v-model="linkEditDialog.url"></v-text-field>
          <v-select
            label="Link Target"
            v-model="linkEditDialog.linkTarget"
            :items="['_self', '_blank', '_parent', '_top']"
          ></v-select>
        </div>
        <v-card-actions>
          <v-btn @click="linkEditDialog.open = false">Schließen</v-btn>
          <!-- TODO validate link format with rules. on text field above-->
          <v-btn
            @click="
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({
                  href: linkEditDialog.url,
                  target: linkEditDialog.linkTarget,
                })
                .run();
              linkEditDialog.open = false;
            "
            >{{
              linkEditDialog.previousUrl == "" ? "Erstellen" : "Bearbeiten"
            }}</v-btn
          >
          <v-btn
            v-if="!(linkEditDialog.previousUrl == '')"
            @click="
              editor.chain().focus().unsetLink().run();
              linkEditDialog.open = false;
            "
            >Link Löschen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-title class="d-flex flex-wrap" v-if="editor">
      <v-btn
        v-for="action in actions"
        :key="action.tooltip"
        :icon="action.icon"
        size="small"
        @click="action.action(editor)"
        :disabled="action.disabled(editor)"
        :active="action.isActive(editor)"
        flat
      >
        <v-icon> {{ action.icon }}</v-icon>
        <v-tooltip activator="parent" location="top">{{
          action.tooltip
        }}</v-tooltip>
      </v-btn>
    </v-card-title>
    <editor-content :editor="editor" />
  </v-card>
</template>

<script lang="ts">
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image"
import { Editor, EditorContent } from "@tiptap/vue-3";

export default {
  methods: {
    editLink(editor: Editor) {
      console.log(editor.getAttributes("link"));
      console.log("href" in editor.getAttributes("link"));
      this.linkEditDialog.previousUrl =
        "href" in editor.getAttributes("link")
          ? editor.getAttributes("link").href
          : "";
      this.linkEditDialog.url = this.linkEditDialog.previousUrl;
      this.linkEditDialog.open = true;
    },
  },
  data() {
    return {
      editor: null,
      linkEditDialog: {
        open: false,
        url: "",
        previousUrl: "",
        linkTarget: "_self",
      },
      actions: [
        {
          tooltip: "undo",
          icon: "mdi-undo",
          action: (editor: Editor): void => {
            editor.chain().focus().undo().run();
          },
          disabled: (editor: Editor): boolean => {
            return !editor.can().chain().focus().undo().run();
          },
          isActive: (_editor: Editor): boolean => {
            return false;
          },
        },
        {
          tooltip: "redo",
          icon: "mdi-redo",
          action: (editor: Editor): void => {
            editor.chain().focus().redo().run();
          },
          disabled: (editor: Editor): boolean => {
            return !editor.can().chain().focus().redo().run();
          },
          isActive: (_editor: Editor): boolean => {
            return false;
          },
        },
        {
          tooltip: "bold",
          icon: "mdi-format-bold",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleBold().run();
          },
          disabled: (editor: Editor): boolean => {
            return !editor.can().chain().focus().toggleBold().run();
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("bold");
          },
        },
        {
          tooltip: "italic",
          icon: "mdi-format-italic",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleItalic().run();
          },
          disabled: (editor: Editor): boolean => {
            return !editor.can().chain().focus().toggleItalic().run();
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("italic");
          },
        },
        {
          tooltip: "strikethrough",
          icon: "mdi-format-strikethrough",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleStrike().run();
          },
          disabled: (editor: Editor): boolean => {
            return !editor.can().chain().focus().toggleStrike().run();
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("strike");
          },
        },
        {
          tooltip: "Link",
          icon: "mdi-link",
          action: (editor: Editor): void => {
            this.editLink(editor);
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("link");
          },
        },
        {
          tooltip: "code",
          icon: "mdi-code-tags",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleCode().run();
          },
          disabled: (editor: Editor): boolean => {
            return !editor.can().chain().focus().toggleCode().run();
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("code");
          },
        },
        {
          tooltip: "clear formating",
          icon: "mdi-eraser",
          action: (editor: Editor): void => {
            editor.chain().focus().unsetAllMarks().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (_editor: Editor): boolean => {
            return false;
          },
        },
        {
          tooltip: "paragraph",
          icon: "mdi-format-paragraph",
          action: (editor: Editor): void => {
            editor.chain().focus().setParagraph().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("paragraph");
          },
        },
        {
          tooltip: "header 1",
          icon: "mdi-format-header-1",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("heading", { level: 1 });
          },
        },
        {
          tooltip: "header 2",
          icon: "mdi-format-header-2",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("heading", { level: 2 });
          },
        },
        {
          tooltip: "header 3",
          icon: "mdi-format-header-3",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("heading", { level: 3 });
          },
        },
        {
          tooltip: "header 4",
          icon: "mdi-format-header-4",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleHeading({ level: 4 }).run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("heading", { level: 4 });
          },
        },
        {
          tooltip: "header 5",
          icon: "mdi-format-header-5",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleHeading({ level: 5 }).run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("heading", { level: 5 });
          },
        },
        {
          tooltip: "header 6",
          icon: "mdi-format-header-6",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleHeading({ level: 6 }).run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("heading", { level: 6 });
          },
        },
        {
          tooltip: "Bulleted list",
          icon: "mdi-format-list-bulleted ",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleBulletList().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("bulletList");
          },
        },
        {
          tooltip: "numbered list",
          icon: "mdi-format-list-numbered ",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleOrderedList().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("orderedList");
          },
        },
        {
          tooltip: "Code Block",
          icon: "mdi-file-code",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleCodeBlock().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("codeBlock");
          },
        },
        {
          tooltip: "Comment block",
          icon: "mdi-format-quote-close",
          action: (editor: Editor): void => {
            editor.chain().focus().toggleBlockquote().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (editor: Editor): boolean => {
            return editor.isActive("blockquote");
          },
        },
        {
          tooltip: "Horizontal line",
          icon: "mdi-minus",
          action: (editor: Editor): void => {
            editor.chain().focus().setHorizontalRule().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (_editor: Editor): boolean => {
            return false;
          },
        },
        {
          tooltip: "Hard Break",
          icon: "mdi-keayboard-return",
          action: (editor: Editor): void => {
            editor.chain().focus().setHardBreak().run();
          },
          disabled: (_editor: Editor): boolean => {
            return false;
          },
          isActive: (_editor: Editor): boolean => {
            return false;
          },
        },
      ],
    };
  },
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue"],

  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
    linkEditDialog: {
      handler(newvalue) {
        if (!newvalue.open) {
          this.linkEditDialog.url = "";
          this.linkEditDialog.previousUrl = "";
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit, Link.configure({ openOnClick: false }),Image],
      content: this.modelValue,
      onUpdate: () => {
        // HTML
        this.$emit("update:modelValue", this.editor.getHTML());

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>
