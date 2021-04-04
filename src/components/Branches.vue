<template>
  <b-card no-body>
    <b-tabs
      v-model="tabIndex"
      card
    >
      <b-tab
        v-for="(b, bi) in branches"
        :key="bi"
      >
        <template #title>
          <div
            v-b-tooltip.hover
            class="tab-title"
            :title="b.name"
          >
            {{ `G${bi+1} - ${b.name}` }}
          </div>
        </template>

        <!-- HEADER -->
        <b-row class="m-0">
          <div class="w-100 border" />
          <b-col
            cols="1"
            class="py-2 text-center"
          >
            Критерії оцінки
          </b-col>
          <b-col
            cols="3"
            class="py-2 text-center"
          >
            Назва критерію
          </b-col>
          <b-col>
            <b-row :cols="yearsRange.length > 6 ? 6 : yearsRange.length">
              <b-col
                v-for="y in yearsRange"
                :key="y"
                class="py-2 text-center"
              >
                {{ y }}
              </b-col>
            </b-row>
          </b-col>
          <b-col
            cols="1"
            class="py-2 text-center"
          >
            Вага
          </b-col>
          <div class="w-100 border" />
        </b-row>

        <!-- BODY -->
        <b-row
          v-for="(bg, bgi) in branchGroups"
          :key="bgi"
          class="m-0"
        >
          <b-col
            v-if="bg.name"
            cols="12"
            class="px-0"
          >
            <div class="w-100 text-center py-2">
              {{ bg.name }}
            </div>
            <div class="w-100 border" />
          </b-col>

          <b-col cols="12">
            <b-row
              v-for="(c, ci) in bg.criteria"
              :key="ci"
            >
              <b-col
                cols="1"
                class="py-2 text-center"
              >
                K {{ ci+1 }}
              </b-col>
              <b-col
                cols="3"
                class="py-2"
              >
                {{ c.name }}
              </b-col>
              <b-col v-if="yearsRange">
                <b-row :cols="yearsRange.length > 6 ? 6 : yearsRange.length">
                  <b-col
                    v-for="(_, cdi) in c.data"
                    :key="cdi"
                    class="py-2"
                  >
                    <b-form-input
                      v-model.number="c.data[cdi]"
                      size="sm"
                      type="number"
                      :placeholder="yearsRange[cdi]"
                      debounce="500"
                    />
                  </b-col>
                </b-row>
              </b-col>
              <b-col
                cols="1"
                class="py-2"
              >
                <b-form-input
                  v-model.number="c.weight"
                  size="sm"
                  type="number"
                  debounce="500"
                />
              </b-col>
              <div class="w-100 border" />
            </b-row>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      tabIndex: 0,
      branchesLoc: null,
    }
  },

  computed: {
    ...mapState({
      branches: s => s.general.data,
    }),

    ...mapGetters({
      yearsRange: 'general/getYearsRange',
    }),

    branchGroups () {
      return this.branchesLoc?.[this.tabIndex]?.groups || []
    },
  },

  watch: {
    branches: {
      handler (val) {
        this.branchesLoc = JSON.parse(JSON.stringify(val))
      },
      immediate: true,
    },

    branchesLoc: {
      handler (nv) {
        const newStr = JSON.stringify(nv)
        const oldStr = JSON.stringify(this.branches)

        if (newStr !== oldStr) {
          const copy = JSON.parse(newStr)

          this.$store.commit('general/setData', copy)
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-title {
  overflow: hidden;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
input {
  text-align: center;
}
</style>
