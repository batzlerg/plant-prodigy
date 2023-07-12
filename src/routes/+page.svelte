<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const QTY_CHOICES = 4;

	let directories = writable<string[]>([]);
	let gameLength = 0;
	let currentPrompt = '';
	let currentChoices: string[] = [];
	let photoUrl = '';
	let points = 0;
	let misses = 0;
	let gameover = false;
	let win = false;

	async function load() {
		const response = await fetch('/api/gameData');
		const json = await response.json();

		directories.set(json.directories);
		gameLength = json.gameLength;
		currentPrompt = json.currentPrompt;
		photoUrl = json.photoUrl;
	}

	async function selectDirectory(directory: string) {
		if (directory === currentPrompt) {
			points++;
		} else {
			misses++;
		}

		if (misses >= 3) {
			gameover = true;
		} else if (points === gameLength) {
			win = true;
		}

		await load();
	}

	function randomizeArray(arr: any[]): any[] {
		return [...arr].sort(() => 0.5 - Math.random());
	}

	function getChoices(list: string[], count: number = QTY_CHOICES): string[] {
		const choices = new Set([currentPrompt]);
		const shuffledSet = randomizeArray(list).sort(() => 0.5 - Math.random());
		while (shuffledSet.length > 0 && choices.size < count) {
			choices.add(shuffledSet.pop());
		}
		return randomizeArray(Array.from(choices));
	}

	$: currentChoices = getChoices($directories);

	onMount(load);
</script>

<div class="container">
	{#if !gameover && !win}
		<div class="header">
			<div class="message">Points: {points}/{gameLength}</div>
			<div class="message">Misses: {misses}/3</div>
		</div>
		<div class="photo-container">
			<img class="photo" src={photoUrl} alt="Prompt Image" aria-hidden="true" />
		</div>
		<div class="button-overlay">
			<div class="grid">
				{#each currentChoices as choice (choice)}
					<button
						class="tile"
						on:click={() => selectDirectory(choice)}
						class:selected={choice === currentPrompt}
					>
						{choice}
					</button>
				{/each}
			</div>
		</div>
	{:else if gameover}
		<h2>Game Over</h2>
		<p>Try again!</p>
		<button on:click={() => window.location.reload()}>Restart</button>
	{:else if win}
		<h2>You Win!</h2>
		<p>Congratulations!</p>
		<button on:click={() => window.location.reload()}>Restart</button>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		height: 100vh;

		display: grid;
		grid-template-rows: 1fr 9fr 6fr;
	}

	.photo-container {
		position: relative;
	}

	.photo {
		max-height: 100%;
		width: 100%;
	}

	.button-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		box-sizing: border-box;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		width: 100%;
	}

	.tile {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 160px;
		background-color: rgba(230, 230, 230, 0.9);
		border: none;
		font-size: 2rem;
		cursor: pointer;
	}

	.tile.selected {
		background-color: #aaa;
	}

	.header {
		box-sizing: border-box;
		margin: 10px;
		display: flex;
		justify-content: flex-end;
	}

	.message {
		font-weight: bold;
		margin-right: 10px;
	}
</style>
