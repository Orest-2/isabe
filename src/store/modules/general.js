import { data } from '../../data/data'

const rangeArr = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start + 1) / step))
    .fill(start)
    .map((x, y) => `${x + y * step}`)

const date = new Date()

const qs = {
  get params () {
    return new URLSearchParams(location.search)
  },
}

export const general = {
  state: {
    yearRange: {
      from: date.getFullYear() - 3,
      to: date.getFullYear() - 1,
    },
    data: [],
  },

  mutations: {
    setYearRange (s, { k, v }) {
      s.yearRange[k] = v
    },

    setData (s, v) {
      s.data = v
    },
  },

  getters: {
    getYearsRange (s) {
      const { from, to } = s.yearRange
      return from <= to ? rangeArr(from, to) : []
    },
  },

  actions: {
    initData ({ commit, getters }) {
      const dataLoc = data.map(
        b => ({
          ...b,
          groups: b.groups.map(
            g => ({
              ...g,
              criteria: g.criteria.map(
                c => {
                  if (qs.params.get('test') !== '1') {
                    c.data = Array(getters.getYearsRange.length).fill('')
                  }

                  return c
                },
              ),
            }),
          ),
        }),
      )

      commit('setData', dataLoc)
    },
  },

  namespaced: true,
}
