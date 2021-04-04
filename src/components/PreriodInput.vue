<template>
  <div>
    <label>Період:</label>
    <b-row
      align-h="between"
      class="mb-2"
    >
      <b-col>
        <b-input-group prepend="З">
          <b-form-input
            v-model.number="periodFrom"
            type="number"
            debounce="500"
          />
        </b-input-group>
      </b-col>
      <b-col>
        <b-input-group prepend="По">
          <b-form-input
            v-model.number="periodTo"
            type="number"
            debounce="500"
          />
        </b-input-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      yrFrom: s => s.general.yearRange.from,
      yrTo: s => s.general.yearRange.to,
    }),

    periodFrom: {
      get () {
        return this.yrFrom
      },
      set (v) {
        this.setYearRange({ k: 'from', v: Number(v) || 0 })
      },
    },

    periodTo: {
      get () {
        return this.yrTo
      },
      set (v) {
        this.setYearRange({ k: 'to', v: Number(v) || 0 })
      },
    },
  },

  methods: {
    ...mapMutations('general', {
      setYearRange: 'setYearRange',
    }),
  },
}
</script>

<style>
</style>
