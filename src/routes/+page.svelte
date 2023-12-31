<script lang="ts">
	import { formatChoice, randomizeArray } from '$lib/utils';
	import { onMount } from 'svelte';

	interface GameData {
		directories: string[];
		gameLength: number;
		currentPrompt: string;
		currentChoices: string[];
		photoUrl: string;
	}

	const QTY_CHOICES = 4;
	const DEBUG_MODE = false; // todo: move to global writable store for settings menu

	let currentChoices: string[] = [];
	let flash = false;

	let currentRoundData: GameData; // todo
	let nextRoundData: GameData; // todo
	let points = 0;
	let misses = 0;
	let playerLost = false;
	let playerWon = false;

	let guess: string;

	async function load() {
		if (!currentRoundData) {
			const response1 = await fetch('/api/gameData');
			currentRoundData = await response1.json();
		} else {
			currentRoundData = nextRoundData;
		}

		currentChoices = getChoices(currentRoundData.directories);

		const response2 = await fetch('/api/gameData');
		nextRoundData = await response2.json();
	}

	async function handleChoiceClick(directory: string) {
		guess = directory;
		const isGuessCorrect = guess === currentRoundData.currentPrompt;
		if (isGuessCorrect) {
			points++;
			if (points === currentRoundData.gameLength) {
				playerWon = true;
			} else {
				await load();
			}
		} else {
			misses++;
			if (misses >= 3) {
				playerLost = true;
			} else {
				flash = true;
				setTimeout(() => {
					flash = false;
				}, 1000); // Reset the flashing animation after 1 second
			}
		}
	}

	function getChoices(list: string[], count: number = QTY_CHOICES): string[] {
		const choices = new Set([currentRoundData.currentPrompt]);
		const shuffledSet = randomizeArray(list).sort(() => 0.5 - Math.random());
		while (shuffledSet.length > 0 && choices.size < count) {
			choices.add(shuffledSet.pop());
		}
		return randomizeArray(Array.from(choices));
	}

	onMount(load);
</script>

<svelte:head>
	{#if !!nextRoundData}
		<link rel="preload" href={nextRoundData.photoUrl} as="image" />
	{/if}
</svelte:head>
<div class="container" class:active-game={currentRoundData && !playerLost && !playerWon}>
	{#if !currentRoundData}
		<!-- todo -->
		<div class="loading">Loading...</div>
	{:else if !playerLost && !playerWon}
		<div class="container--header">
			<div class="message">Points: {points}/{currentRoundData.gameLength}</div>
			<div class="message">Misses: {misses}/3</div>
		</div>
		<div class="container--photo">
			<div class="photo-zoom">
				<img class="photo" src={currentRoundData.photoUrl} alt="Prompt Image" aria-hidden="true" />
			</div>
		</div>
		<div class="container--choices">
			{#each currentChoices as choice (choice)}
				<button
					class="tile {flash && guess === choice && !playerWon ? 'flash' : ''}"
					on:click={() => handleChoiceClick(choice)}
					class:selected={DEBUG_MODE && choice === currentRoundData.currentPrompt}
				>
					{formatChoice(choice)}
				</button>
			{/each}
		</div>
	{:else if playerLost}
		<h2>Game Over</h2>
		<p>Try again!</p>
		<button on:click={() => window.location.reload()}>Restart</button>
	{:else if playerWon}
		<h2>You win!</h2>
		<p>Congratulations!</p>
		<button on:click={() => window.location.reload()}>Restart</button>
	{/if}
</div>

<style>
	.container {
		margin: 0 auto;
		height: 100vh;
		max-height: -moz-available;
		max-height: -webkit-fill-available;
		max-height: fill-available;
		box-sizing: border-box;
		display: grid;
		grid-template-rows: 1fr;
	}

	.loading {
		margin: 0 auto;
		align-self: center;
	}

	.container.active-game {
		grid-template-rows: 2fr 98fr 50fr;
	}

	.container--header {
		box-sizing: border-box;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.container--photo {
		grid-row: 2;
		grid-column: 1 / -1;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		padding: 10px;
	}

	.photo-zoom {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.photo {
		width: 100%;
		height: auto;
		object-fit: contain;
		object-position: center center;
	}

	.container--choices {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
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
		font-size: 1.2rem;
		cursor: pointer;
		padding: 1rem;
	}

	@keyframes flashAnimation {
		0% {
			background-color: #ff0000; /* Starting color - red */
		}
		100% {
			background-color: rgba(230, 230, 230, 0.9); /* Default color */
		}
	}

	.tile.flash {
		animation: flashAnimation 1s;
	}

	@media (min-width: 800px) {
		.container {
			max-width: 800px;
		}
		.tile {
			font-size: 2rem;
		}
	}

	@media (hover: hover) {
		.tile:hover {
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.message {
		font-weight: bold;
		margin-right: 10px;
	}
</style>
