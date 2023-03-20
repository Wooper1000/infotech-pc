import {createStore} from "vuex";

export const store = createStore({
    state() {
        return {
            salary: null,
            isLoading: Boolean,
            statusFilters: {
                currentStatus:'active',
                filters:
                    {
                        active: {
                            statusList:['Не хватает документов', 'В работе', 'Собрана', 'На сборку', 'В очереди'],
                            orders:[]
                        },
                        inactive: {
                            statusList:['Работы выполнены', 'Отрисовка Visio'],
                            orders:[]
                        }
                    },
            },
        }
    },
    mutations: {
        setOrders(state, orders) {
            state.statusFilters.filters.active.orders=[]
            state.statusFilters.filters.inactive.orders=[]
            orders.map(order => {
                let filters = state.statusFilters.filters.active.statusList
                for (let i = 0; i <= filters.length; i++) {
                    if (order['ТекущийСтатус'] === filters[i]) {
                        state.statusFilters.filters.active.orders.push(order)
                        return
                    }
                }
                state.statusFilters.filters.inactive.orders.push(order)
            })
        },
        setFiltersStatus(state,status){
            state.statusFilters.currentStatus=status
        },
        isLoading(state, value) {
            state.isLoading = value
        },
        setSalary(state, value) {
            state.salary = value
        },
        setEquipment(state,value){
            state.equipment = value
        }
    },
    getters: {
        ordersSortedByDays : (state) => (status)=> {
            let days = []
            state.statusFilters.filters[status].orders.map(order => {
                let orderDate = order['ПланДатаНачала']
                if (days.find((day) => day.date === orderDate)) {
                    days.find((day) => day.date === orderDate).orders.push(order)
                } else {
                    days.push({date: orderDate, orders: [order]})
                }
            })

            return days.map(day => {
                return {
                    ...day,
                    orders: day.orders.sort((a, b) => {
                        return new Date(a['ПланДатаНачала'].split('T')[0] + 'T' + a['ПланВремяНачала'].split('T')[1]).getTime() - new Date(b['ПланДатаНачала'].split('T')[0] + 'T' + b['ПланВремяНачала'].split('T')[1]).getTime()
                    })
                }
            }).sort((a, b) => new Date(a.date) - new Date(b.date))
        }
    },
})