<template>
  <div id="app">
    <div id="nav">
      <nav-bar />
    </div>
    <b-container fluid>
      <router-view />
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import NavBar from './components/NavBar.vue'

export default {
  components: { NavBar },

  computed: {
    ...mapState({
      yearRangeFrom: s => s.general.yearRange.from,
      yearRangeTo: s => s.general.yearRange.to,
      branches: s => s.general.data,
    }),
  },

  watch: {
    yearRangeFrom: {
      handler (nv, ov) {
        this.updateData('begin', ov - nv)
      },
      deep: true,
    },
    yearRangeTo: {
      handler (nv, ov) {
        this.updateData('end', nv - ov)
      },
      deep: true,
    },
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('general', {
      initData: 'initData',
    }),

    updateData (from, dir) {
      const copy = JSON.parse(JSON.stringify(this.branches))

      const newData = copy.map(
        b => ({
          ...b,
          groups: b.groups.map(
            g => ({
              ...g,
              criteria: g.criteria.map(
                c => {
                  switch (from) {
                    case 'begin':
                      if (dir > 0) {
                        c.data.unshift(...Array(dir).fill(''))
                      }

                      if (dir < 0) {
                        c.data = c.data.slice(-dir)
                      }
                      break

                    case 'end':
                      if (dir > 0) {
                        c.data.push(...Array(dir).fill(''))
                      }

                      if (dir < 0) {
                        c.data = c.data.slice(0, dir)
                      }
                      break
                  }

                  return c
                },
              ),
            }),
          ),
        }),
      )

      this.$store.commit('general/setData', newData)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
