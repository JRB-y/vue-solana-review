import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import SolanaWallets from 'solana-wallets-vue'
import 'solana-wallets-vue/styles.css';

const walletOptions = {
    wallets: [],
    autoConnect: true,
}

createApp(App).use(SolanaWallets, walletOptions).mount('#app')
