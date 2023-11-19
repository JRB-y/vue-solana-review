<script setup lang="ts">
  import { WalletMultiButton, useWallet } from 'solana-wallets-vue'
  import { Ref, ref } from 'vue'
  import { Review } from './Review'
  import { Connection, clusterApiUrl, SystemProgram, Transaction, PublicKey, TransactionInstruction } from '@solana/web3.js'

  const message: Ref= ref({
    name: '',
    message: '',
  })

  const submitFormHandler = () => {
    const review = new Review(message.value.name, message.value.message)
    handleTransactionSubmit(review)
  }


  const handleTransactionSubmit = async (review: Review) => {
    const connection = new Connection(clusterApiUrl('devnet'));

    const { publicKey, sendTransaction } = useWallet();
  
    if (!publicKey.value){
      alert('Please connecte your wallet')
      return
    }

    const buffer = review.serialize();


    const [pda] = await PublicKey.findProgramAddress(
      [publicKey.value.toBuffer(), new TextEncoder().encode(message.value.name)],
      new PublicKey('HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'),
    )

    // 6qD27eRt7xtxgCsoB6Xa2SCqbWn4zBPWJdayT3FLDCac
    console.log('pda', pda.toBase58())

    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey.value,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        }
      ],
      data: buffer,
      programId: new PublicKey('HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf')
    })

    const transaction = new Transaction();

    transaction.add(instruction);

    try {
      // let lastBlockhash = await connection.getLatestBlockhash('finalized')
      // transaction.recentBlockhash = lastBlockhash.blockhash
      let txid = await sendTransaction(transaction, connection)
      console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }

  



</script>

<template>
  <header>
    <h1>SOLANA:push</h1>
    <WalletMultiButton dark />
  </header>

  <main>
    <h2>Write your intro to Solana blockchain</h2>

    <form id="form" name="form" @submit.prevent="submitFormHandler">

      <div class="form-group">
        <label for="name">Your name</label>
        <input type="text" name="name" id="name" v-model="message.name">
      </div>

      <div class="form-group">
        <label for="message">Your message</label>
        <textarea v-model="message.message"></textarea>
      </div>

      <div class="form-group">
        <button type="submit" :disabled="!message.name || !message.message">Send on chain</button>
      </div>

    </form>
  </main>
</template>

<style scoped>
  .swv-button-trigger {
    background-color: #4f46e5 !important;
  }
</style>
