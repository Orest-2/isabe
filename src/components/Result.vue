<template>
  <div v-if="results">
    <div class="text-center">
      <h4>Результат</h4>
      <p>
        Найперспективніші галузі економіки, досліджувані за останні звітні періоди, такі:
      </p>
    </div>
    <div class="d-flex justify-content-center">
      <ul>
        <div
          v-for="(d,i) in z"
          :key="d.n"
          :class="{
            'text-success font-weight-bold': i<=2,
          }"
        >
          G{{ d.n+1 }} - {{ d.name }}
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { data } from '../data/data'

export default {
  computed: {
    ...mapState('calculator', {
      results: s => s.results,
    }),

    z () {
      const { step4 } = JSON.parse(JSON.stringify(this.results))
      return step4.sort((a, b) => b.data - a.data).map(el => ({ ...el, name: data[el.n].name }))
    },
  },
}
</script>

<style>
</style>
