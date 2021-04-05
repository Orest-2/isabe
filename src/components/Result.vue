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

    <b-card no-body>
      <b-card-header
        header-tag="header"
        class="p-1"
        role="tab"
      >
        <b-button
          v-b-toggle.result-accordion
          block
          variant="info"
        >
          Проміжні значення
        </b-button>
      </b-card-header>
      <b-collapse
        id="result-accordion"
        role="tabpanel"
      >
        <b-card-body>
          <div class="text-center mb-2">
            1 крок. <b>Нормування вхідних даних</b>
          </div>
          <pre class="d-flex justify-content-between">
            <code
              v-for="(rr1,i) in step1Raw"
              :key="i"
            >G{{ i+1 }} = {{ rr1 }}</code>
          </pre>

          <div class="text-center mb-1">
            Нормовані вагові коефіцієнти
          </div>
          <pre class="d-flex justify-content-center">
            <code>{{ results.step1[0].a.map(e => e.toFixed(4)) }}</code>
          </pre>

          <div class="text-center mb-2">
            2 крок. <b>Знайдемо нормовану оцінку діяльності галузей економіки по роках</b>
          </div>
          <pre class="d-flex flex-column align-items-center">
            <code>     {{ yearsRange.join('  |  ') }}</code>
            <code
              v-for="(rr2,i) in step2Raw"
              :key="i"
            >G{{ i+1 }} = {{ rr2 }}</code>
          </pre>

          <div class="text-center mb-2">
            3 крок. <b>Шукаємо темп рівня зростання показників діяльності галузей</b> {{ t[1] }}
          </div>
          <pre class="d-flex flex-column align-items-center">
            <code>     {{ t[0] }}</code>
            <code
              v-for="(rr3,i) in step3Raw"
              :key="i"
            >G{{ i+1 }} = {{ rr3 }}</code>
          </pre>

          <div class="text-center mb-2">
            4 крок. <b>Шукаємо темп середнього зростання</b>
          </div>
          <pre class="d-flex flex-column align-items-center">
            <code
              v-for="(rr4,i) in step4Raw"
              :key="i"
            >G{{ i+1 }} = {{ rr4 }}</code>
          </pre>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { data } from '../data/data'

export default {
  computed: {
    ...mapState('calculator', {
      results: s => s.results,
    }),

    ...mapGetters({
      yearsRange: 'general/getYearsRange',
    }),

    z () {
      const { step4 } = JSON.parse(JSON.stringify(this.results))
      return step4.sort((a, b) => b.data - a.data).map(el => ({ ...el, name: data[el.n].name }))
    },

    step1Raw () {
      const { step1 } = JSON.parse(JSON.stringify(this.results))

      const o = step1.map(branch => {
        const r = branch.O.map(o => o.data.map(e => e.toFixed(4)).join(' | '))
        return JSON.stringify(r, undefined, 2).trim()
      })

      return o
    },

    step2Raw () {
      const { step2 } = JSON.parse(JSON.stringify(this.results))

      const o = step2.map(branch => {
        const r = branch.data.map(e => e.toFixed(4)).join(' | ')
        return r
      })

      return o
    },

    t () {
      const t = []
      const tf = []

      for (let i = 0; i < this.yearsRange.length - 1; i++) {
        t.push(`T(${i + 1})`)
        tf.push(`T(${i + 1}) ${this.yearsRange[i + 1]} / ${this.yearsRange[i]}`)
      }
      return [t.join(' | '), tf.join(', ')]
    },

    step3Raw () {
      const { step3 } = JSON.parse(JSON.stringify(this.results))

      const o = step3.map(data => {
        const r = data.map(e => e.toFixed(4)).join(' | ')
        return r
      })

      return o
    },

    step4Raw () {
      const { step4 } = JSON.parse(JSON.stringify(this.results))

      const o = step4.map(branch => {
        const r = branch.data.toFixed(4)
        return r
      })

      return o
    },
  },
}
</script>

<style>
</style>
