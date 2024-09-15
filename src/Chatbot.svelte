<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	



	let showModal = false;
	const maxMessagesPerDay = 7;
	let messagesCount = 0;

	function checkUserActivity() {
    // Get the date
    let today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Get the user's activity from localStorage
    let userActivity = localStorage.getItem('userActivity');

    // If the user's activity is not in localStorage or is from a different day
    if (!userActivity || JSON.parse(userActivity).date !== today) {
      userActivity = JSON.stringify({ date: today, messages: 0 });
      localStorage.setItem('userActivity', userActivity);
	  messagesCount=userActivity.messages;
    }

    return JSON.parse(userActivity).messages;
  }

  function incrementUserActivity() {

    let userActivity = JSON.parse(localStorage.getItem('userActivity'));
    userActivity.messages += 1;
	messagesCount+=1;
    localStorage.setItem('userActivity', JSON.stringify(userActivity));
  }

  function canUserSendMessage() {
    return checkUserActivity() < maxMessagesPerDay;
  }


    let isUserInputting = false; // Flag to track user input



	let query: string = ''
	let answer: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = [];
	function handleUserInput() {
		let userActivity = JSON.parse(localStorage.getItem('userActivity'));
	messagesCount=userActivity.messages;

    isUserInputting = true; // Set flag to true when user starts inputting

  }
  




	const handleSubmit = async () => {
		if (!canUserSendMessage()) {
			messagesCount=maxMessagesPerDay;
			showModal=true;
			
    return;
  }
  else{incrementUserActivity()}
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



<div class="flex flex-col position-relative min-h-screen pt-4 w-screen items-center gap-2 z-10">


	
	<div class="h-[700px] xl:w-1/2 w-full lg:w-2/3 bg-white bg-opacity-80	rounded-[1rem]  p-4 overflow-y-auto flex flex-col gap-4">
		<div class="flex-reversed flex-col gap-2 opacity-100">
		
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
	<div class ='xl:w-1/2 w-full lg:w-2/3 '>
	<form
		class="flex w-full gap-1 bg-transparent p-2"
		on:submit|preventDefault={() => handleSubmit()}
		on:click={handleUserInput}
	  >
	
		<input
		  use:init
		  type="text"
		  class="input input-bordered border-orange-400 border-10 w-full bg-white rounded-l-full text-black"
		  bind:value={query}
		/>
		<button
		  type="submit"
		  class="btn hover:bg-[#DC7E60] bg-orange-400 border-transparent rounded-r-full"
		>
		  <svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
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
	  <div class = "flex justify-between">
		
		<p class="text-md mx-6 font-normal italic text-gray-50">  			{messagesCount}/{maxMessagesPerDay} Daily Messages</p>
	</div>

	</div>

</div>




{#if showModal}
<script>
	let showModal;
	let maxMessagesPerDay;
	</script>
	
	<div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none max-w-2lx focus:outline-none justify-center items-center flex">
		<div class="relative my-6  mx-auto">
		  <!--content-->
		  <div class="border-0 rounded-lg shadow-lg relative text-black flex flex-col w-full bg-white outline-none focus:outline-none">
			<!--header-->
			<div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
				<div class="text-3xl font-bold mb-4">
					Out of messages 😔
				  </div>
			  <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" on:click={showModal=!showModal}>
				<span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
				  ×
				</span>
			  </button>
			</div>
			<!--body-->
			<div class ="lg:w-1/2 md:w-2/3 w-full mx-auto gap-4">
				<div class="text-xl font-extrabold py-2 leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
					Today, you've used up your {maxMessagesPerDay} messages as an free-tier user. 🎉
				  </div>
				  <div class="text-xl font-extrabold py-2 leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r to-orange-600 from-pink-400 dark:text-white md:text-2xl lg:text-3xl">
					Get Premium for €20.00/month to unlock <span class="underline underline-offset-3 decoration-4 decoration-blue-400 dark:decoration-blue-600">unlimited messages.</span>
				  </div>
				
				<div class="text-lg font-light py-2 leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r to-orange-600 from-pink-400 dark:text-white md:text-2xl lg:text-3xl">
					(It may take a day for your account to become active after subscribing. You will receive an email notification when it's ready!)
				  </div>
			
			
			</div>
			<!--footer-->
			<div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
			  <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" on:click={()=>{showModal=!showModal}}>
				I'll just wait!
			  </button>
			  <button class="bg-orange-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" on:click={() => { window.location.href = "https://buy.stripe.com/dR66qZ8mPbGe45W28c"; }}>
				Try Premium for free for 14 days 🌟          </button>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
{/if}

