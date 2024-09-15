<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string
	let showMessage = false;
	let messageElement;
	
	onMount(() => {
		messageElement.addEventListener('click', () => {
			navigator.clipboard.writeText(messageElement.textContent);
			showMessage = true;
			setTimeout(() => {
				showMessage = false;
			}, 2000);
		});
	});
</script>


<div class={`flex mx-4 my-2 items-start ${type === 'user' ? 'justify-start' : 'justify-start'} gap-2`}>

	<div class="flex flex-col">

	  <div 
		class={`p-2 max-w-3xl rounded-lg '}`}
		bind:this={messageElement}
	  >
	  <div class="text-md mb-2 font-medium leading-relaxed ">
		{#if type === 'user'}
		Designer: {@html message}
	  {:else}
		Natalie: {@html message}
	  {/if}
	</div>
	  </div>

	</div>

</div>

<style>
	.bubble {
		position: absolute;
		background-color: #555;
		color: white;
		text-align: center;
		border-radius: 10px;
		padding: 10px;
		animation: fadeout 2s, floatup 2s;
	}
	@keyframes fadeout {
		from {opacity: 1;}
		to {opacity: 0;}
	}
	@keyframes floatup {
		from {transform: translateY(0);}
		to {transform: translateY(-100px);}
	}
</style>
