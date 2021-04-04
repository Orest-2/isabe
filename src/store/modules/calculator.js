
const sum = (arr) => arr.reduce((s, e) => (s += e), 0)

const transpose = (matrix) => {
  return matrix.reduce(
    (prev, next) =>
      next.data.map(
        (_, i) => {
          const data = (prev[i]?.data || []).concat(next.data[i])

          const res = { data }

          if ('max' in next) {
            res.max = Math.max(...data)
          }

          if ('min' in next) {
            res.min = Math.min(...data)
          }

          if ('sum' in next) {
            res.sum = sum(data)
          }

          return res
        },
      ),
    [],
  )
}

const prepareData = (branch) => {
  const branchDataMtx = []
  const weights = []

  const criteria = branch.groups.map(group => group.criteria).flat()

  criteria.forEach(criterio => {
    branchDataMtx.push({
      data: criterio.data,
      max: Math.max(...criterio.data),
      min: Math.min(...criterio.data),
    })
    weights.push(criterio.weight)
  })

  return {
    dataMtx: branchDataMtx,
    dataMtxT: transpose(branchDataMtx),
    weights,
    weightsSum: sum(weights),
  }
}

export const calculator = {
  state: {
    results: null,
  },

  mutations: {
    setResults (s, v) {
      s.results = v
    },
  },

  actions: {
    async calculate ({ commit, rootState }) {
      console.time('calculate')
      const data = JSON.parse(JSON.stringify(rootState.general.data))

      const dataMapped = data.map((branch) => prepareData(branch))

      const step1 = dataMapped.map(
        branch => {
          const a = branch.weights.map(w => w / branch.weightsSum)

          const [O, aO] = branch.dataMtx.reduce(
            (res, row) => {
              const [d1, d2] = row.data.reduce(
                (res1, v, i) => {
                  const o = v / row.max
                  res1[0].push(o)
                  res1[1].push(o * a[i])
                  return res1
                },
                [[], []],
              )

              res[0].push({ data: d1 })
              res[1].push({ data: d2, sum: 0 })
              return res
            },
            [[], []],
          )

          return { O, aO, aOT: transpose(aO), a }
        },
      )

      const step2 = step1.map(branch => {
        const mG = branch.aOT.map(el => el.sum)
        return { data: mG }
      })

      const [step3, step4] = step2.reduce(
        (res, branch, i) => {
          let mt = 1
          const t = []

          for (let i = 0; i < branch.data.length - 1; i++) {
            const tl = branch.data[i + 1] / branch.data[i]
            mt *= tl
            t.push(branch.data[i + 1] / branch.data[i])
          }

          res[0].push(t)
          res[1].push({ data: Math.sqrt(mt), n: i })

          return res
        },
        [[], []],
      )

      commit(
        'setResults',
        {
          step1,
          step2,
          step3,
          step4,
        },
      )

      console.timeEnd('calculate')
    },
  },

  namespaced: true,
}
