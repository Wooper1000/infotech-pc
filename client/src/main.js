import {createApp} from 'vue'
import {createStore} from "vuex";
import App from './App.vue'


const store = createStore({
    state() {
        return {
            orders: [],
            salary:null,
            isLoading: Boolean,
            statusFilters:{
                quickStatus:'active',
                filters:['Не хватает документов', 'В работе', 'Собрана', 'На сборку', 'В очереди']
            }
        }
    },
    mutations: {
        setOrders(state, orders) {
            state.orders = orders
        },
        setStatusFilters(state,filters){
          state.statusFilters.filters = filters.filters
          state.statusFilters.quickStatus = filters.quickStatus

        },
        isLoading(state, value) {
            state.isLoading = value
        },
        setSalary(state,value){
            state.salary = value
        }
    },
    getters: {
        ordersSortedByDays(state) {
            let days = []
            state.orders.filter(order=>{
                let filters = state.statusFilters.filters
                for(let i=0;i<=filters.length;i++){
                    if(order['ТекущийСтатус'] === filters[i]) return true
                }
            }).map(order => {
                let orderDate = order['ПланДатаНачала']
                if (days.find((day) => day.date === orderDate)) {
                    days.find((day) => day.date === orderDate).orders.push(order)
                } else {
                    days.push({date: orderDate, orders: [order]})
                }
            })

            return days.map(day=>{
                return {
                    ...day,
                    orders:day.orders.sort((a,b)=>{
                        return new Date(a['ПланДатаНачала'].split('T')[0]+'T'+a['ПланВремяНачала'].split('T')[1]).getTime()-new Date(b['ПланДатаНачала'].split('T')[0]+'T'+b['ПланВремяНачала'].split('T')[1]).getTime()
                    })
                }
            }).sort((a, b) => new Date(a.date) - new Date(b.date))}
    },
})

const app = createApp(App)

app.use(store)
app.mount('#app')