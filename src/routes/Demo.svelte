<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	


    let isUserInputting = false; // Flag to track user input



	let query: string = ''
	let answer: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = [];
	function handleUserInput() {


    isUserInputting = true; // Set flag to true when user starts inputting

  }
  




	const handleSubmit = async () => {
	
		loading = true
		chatMessages = [...chatMessages, { role: 'user', content: query }]

		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: chatMessages })
		})

		query = ''

		eventSource.addEventListener('error', handleError)

		eventSource.addEventListener('message', (e) => {

			try {
				loading = false
				if (e.data === '[DONE]') {
					chatMessages = [...chatMessages, { role: 'assistant', content: answer }]
					answer = ''
					return
				}

				const completionResponse = JSON.parse(e.data)
				const [{ delta }] = completionResponse.choices

				if (delta.content) {
					answer = (answer ?? '') + delta.content
				}
			} catch (err) {
				handleError(err)
			}
		})
		eventSource.stream()

	}

	function handleError<T>(err: T) {
		loading = false
		query = ''
		answer = ''
		console.error(err)
	}


function init(el){
    el.focus()
  }
 
</script>

<title>Digital AI Doula </title>



<div class="flex flex-col position-relative pt-4 w-screen items-center gap-2 z-10">


	
	<div class="h-[700px]  w-full  bg-white bg-opacity-80	rounded-[1rem]  p-4 overflow-y-auto flex flex-col gap-4">
		<div class="flex-reversed flex-col gap-2 opacity-100">
			<ChatMessage type="assistant" message="Hi, I'm Natalie" />

				{#each chatMessages as message}
				<ChatMessage type={message.role} message={message.content} />
			{/each}
			{#if answer}
				<ChatMessage type="assistant" message={answer} />
			{/if}
			{#if loading}
				<ChatMessage type="assistant" message="Loading.." />
			{/if}
		</div>
	
</div>
	<div class ='w-full '>
	<form
		class="flex w-full gap-1 bg-transparent"
		on:submit|preventDefault={() => handleSubmit()}
		on:click={handleUserInput}
	  >
	
	  <input
	  use:init
	  type="text"
	  class="input input-bordered w-full bg-white text-black"
	  bind:value={query}
	  placeholder="Enter your question here"
	  aria-label="Query input"
	/>
	
		<button
		  type="submit"
		  class="btn hover:bg-[#DC7E60] bg-black border-transparent "
		>
		  <svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="white"
			class="w-6 h-6"
		  >
			<path
			  stroke-linecap="round"
			  stroke-linejoin="round"
			  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
			/>
		  </svg>
		</button>
	
	  </form>

	</div>

</div>

