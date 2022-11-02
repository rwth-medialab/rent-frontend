<template>
  <v-container my-5>
    <div class="devicemanagement">
      <v-row>
      <v-col>
        <h1>
          {{ rentalobjecttype.name }}
        </h1>
        <h4>
          {{ rentalobjecttype.description }}
        </h4>
      </v-col>
      <v-col class="text-right">
        <v-img :src="rentalobjecttype.image" width="100" height="100" />
      </v-col>
    </v-row>
      <v-layout wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="(rentalobject, index) in rentalobjects" :key=index>
          <v-card class="ma-3" outlined :href="'/admin/objects/' + rentalobject.id">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  {{ rentalobjecttype.prefix_identifier + rentalobject.id }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="80" color="grey">
                <v-img :src="rentalobjecttype.image" />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { useUserStore } from '@/store/user.js'
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  name: 'DeviceManagementView',
  data: () => {
    return {
      rentalobjecttype:
        { id: 1, name: 'placeholder', description: 'placeholdertext' },
      rentalobjects:
        [
        ]
    }
  },
  methods: {
    async updateData() {
      const targetUrl = '/api/rentalobjecttypes/' + this.$route.params.id + "/";
      this.rentalobjecttype = await this.userStore.getUrl(targetUrl)
      const rentalobjectsarray = []
      for (const rentalobject of this.rentalobjecttype.rentalobjects) {
        const result = await this.userStore.getUrl('/api/rentalobjects/' + rentalobject + '/')
        rentalobjectsarray.push(result)
      }
      this.rentalobjects = rentalobjectsarray
    }
  },
  mounted() {
    this.updateData()

  },
}

</script>