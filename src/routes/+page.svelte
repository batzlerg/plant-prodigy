<script lang="ts">
	import { formatChoice, randomizeArray } from '$lib/utils';
	import { onMount } from 'svelte';

	const QTY_CHOICES = 4;
	const DEBUG_MODE = false; // todo: move to global writable store for settings menu

	let directories: string[] = [];
	let gameLength = 0;
	let currentPrompt = '';
	let currentChoices: string[] = [];
	let photoUrl = '';

	let thisRoundData: any; // todo
	let nextRoundData: any; // todo
	let points = 0;
	let misses = 0;
	let gameover = false;
	let win = false;

	async function load() {
		if (!thisRoundData) {
			const response1 = await fetch('/api/gameData');
			thisRoundData = await response1.json();
		} else {
			thisRoundData = nextRoundData;
		}

		directories = thisRoundData.directories;
		gameLength = thisRoundData.gameLength;
		currentPrompt = thisRoundData.currentPrompt;
		photoUrl = thisRoundData.photoUrl;

		const response2 = await fetch('/api/gameData');
		nextRoundData = await response2.json();
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

	function getChoices(list: string[], count: number = QTY_CHOICES): string[] {
		const choices = new Set([currentPrompt]);
		const shuffledSet = randomizeArray(list).sort(() => 0.5 - Math.random());
		while (shuffledSet.length > 0 && choices.size < count) {
			choices.add(shuffledSet.pop());
		}
		return randomizeArray(Array.from(choices));
	}

	$: currentChoices = getChoices(directories);

	onMount(load);
</script>

<div class="container">
	{#if !gameover && !win}
		<div class="header">
			<div class="message">Points: {points}/{gameLength}</div>
			<div class="message">Misses: {misses}/3</div>
		</div>
		<div class="photo-container">
			<div class="photo-zoom">
				<img class="photo" src={photoUrl} alt="Prompt Image" aria-hidden="true" />
			</div>
		</div>
		<div class="choices">
			{#each currentChoices as choice (choice)}
				<button
					class="tile"
					on:click={() => selectDirectory(choice)}
					class:selected={DEBUG_MODE && choice === currentPrompt}
				>
					{formatChoice(choice)}
				</button>
			{/each}
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
		margin: 0 auto;
		width: 100%;
		max-width: 800px;
		height: 100vh;
		box-sizing: border-box;
		display: grid;
		grid-template-rows: 2fr 98fr 50fr;
		overflow-x: auto;
	}

	@media (max-width: 800px) {
		.container {
			width: 100%;
		}
	}

	.photo-container {
		grid-row: 2;
		grid-column: 1 / -1;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.photo-zoom {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.photo {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center center;
	}

	.choices {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		padding: 10px;
		justify-items: center;
		align-items: center;
	}

	.tile {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		background-color: rgba(230, 230, 230, 0.9);
		border: none;
		font-size: 2rem;
		cursor: pointer;
	}

	.tile:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.header {
		box-sizing: border-box;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.message {
		font-weight: bold;
		margin-right: 10px;
	}
</style>
