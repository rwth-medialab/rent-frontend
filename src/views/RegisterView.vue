<script lang="ts">
import { useUserStore } from "@/stores/user";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      registrationForm: {
        valid: false,
        data: {
          lastname: "",
          firstname: "",
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
        },
        notEmptyRules: [
          (v: string) => !!v || "Das Passwort darf nicht leer sein.",
        ],
        passwordRules: [
          (v: string) => !!v || "Das Passwort darf nicht leer sein.",
          (v: string) =>
            v.length > 7 || "Das Passwort muss mindestens 8 Zeichen enthalten.",
        ] as ((v: string) => boolean | string)[],
        usernameRules: [
          (v: string) => !!v || "Der Nutzername darf nicht leer sein",
          (v: string) =>
            v.length > 3 || "Der Nutzername besteht aus mehr als 3 Zeichen",
          (v: string) =>
            /^[0-9a-zA-Z]+$/.test(v) ||
            "Der Nutzername besteht nur aus Ziffern und Buchstaben",
        ],
        emailRules: [
          (v: string) =>
            new RegExp("@([a-zA-Z0-9]+\\.)?rwth-aachen\\.de", "i").test(v) ||
            "Die Email ist nicht vom Format @...rwth-aachen.de",
        ] as ((v: string) => boolean | string)[],
      },
    };
  },
  methods: {
    async register() {
      if (this.registrationForm.valid) {
        let msg = "";
        let type = "success" as "warning" | "success" | "error" | "info";
        try {
          const ret = await this.userStore.postURLWithoutAuth({
            url: "users",
            params: this.registrationForm.data,
          });
          msg =
            "Dein Account wurde angelegt, bitte klicke auf den Link in der Email.";
          console.log(ret);
        } catch (error) {
          Object.keys(error["response"]["data"]).forEach(
            (errorkey) => (msg += error["response"]["data"][errorkey])
          );
          type = "warning";
        }
        this.userStore.alert(msg, type, 10000);
      }
    },
  },
  mounted() {
    this.registrationForm.passwordRules.splice(
      0,
      0,
      (v: string) =>
        v == this.registrationForm.data.confirmPassword ||
        "Das Passwort stimmt nicht mit der Wiederholung überein"
    );
  },
  computed: {},
};
</script>
<template>
  <v-card class="ma-3">
    <v-container class="">
      <div class="text-h3">Registrierung</div>
      <hr class="my-2" />
      <v-form @submit.prevent="register" v-model="registrationForm.valid">
        <v-text-field
          :rules="registrationForm.notEmptyRules"
          type="lastname"
          label="Nachname"
          v-model="registrationForm.data.lastname"
          required
        />
        <v-text-field
          :rules="registrationForm.notEmptyRules"
          type="firstname"
          label="Vorname"
          v-model="registrationForm.data.firstname"
          required
        />
        <v-text-field
          :rules="registrationForm.usernameRules"
          type="username"
          label="Nutzername"
          v-model="registrationForm.data.username"
          required
        />
        <v-text-field
          type="email"
          label="Email"
          :rules="registrationForm.emailRules"
          v-model="registrationForm.data.email"
          required
        />
        <v-text-field
          type="password"
          label="Passwort"
          :rules="registrationForm.passwordRules"
          v-model="registrationForm.data.password"
          required
        />
        <v-text-field
          type="password"
          label="Passwortwiederholung"
          v-model="registrationForm.data.confirmPassword"
          required
        />
        <v-btn type="submit">Registrieren</v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>
