<template>
  <div class="pb-4">
    <preriod-input />
    <branch-tabs />

    <div class="w-100 text-center py-2">
      <b-btn @click="calculate">
        Обчислити
      </b-btn>
    </div>

    <result class="mt-4" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BranchTabs from '../components/Branches.vue'
import PreriodInput from '../components/PreriodInput.vue'
import Result from '../components/Result.vue'

export default {
  name: 'Home',

  components: { PreriodInput, BranchTabs, Result },

  methods: {
    ...mapActions({
      calculate: 'calculator/calculate',
    }),
  },
}
</script>
