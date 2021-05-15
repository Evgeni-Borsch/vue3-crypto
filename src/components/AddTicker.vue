<template>
    <section>
      <div class="flex">
        <div class="max-w-xs">
          <label for="wallet" class="block text-sm font-medium text-gray-700"
            >Тикер</label
          >
          <div class="mt-1 relative rounded-md shadow-md">
            <input
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
              v-model="ticker"
              @keydown.enter="add"
            />
          </div>
          <div class="flex bg-white shadow-md p-1 rounded-md flex-wrap">
            <span @click="this.ticker = 'BTC'" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              BTC
            </span>
            <span @click="this.ticker = 'DOGE'" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              DOGE
            </span>
            <span @click="this.ticker = 'BNB'" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              BNB
            </span>
            <span @click="this.ticker = 'ETH'" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              ETH
            </span>
          </div>
          <div class="text-sm text-red-600">Такой тикер уже добавлен!</div>
        </div>
      </div>
      <add-button
        @click="add"
        :disabled="disabled"
        class="my-4"
      />
    </section>
</template>

<script>
import AddButton  from './AddButton.vue'

export default {
    data() {
        return {
            ticker:''
        }
    },
    props:{
        disabled:{
            type: Boolean,
            required: false,
            default:false
        }
    },
    components:{
        AddButton
    },
    emits:{
        "add-ticker": value => typeof value ==='string'&&value.length>0
    },
    methods:{
        add(){
            if(this.ticker.length === 0){
                return
            }
           this.$emit('add-ticker', this.ticker);
           this.filter = '';
        }
    },
}
</script>
