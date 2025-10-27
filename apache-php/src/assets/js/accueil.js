
Vue.createApp({
  data() {
    return {

    };
    },
    computed: {

    },
    methods: {
      goTo(page) {
            if (page === 'jeu') {
                window.location.href = '/jeu';
            } else if (page === 'hall_of_fame') {
                window.location.href = '/hall_of_fame';
            } else if (page === 'info') {
                window.location.href = '/info';
            }
        },
    }
}).mount('#app');