<script lang="ts">
	import { onMount } from 'svelte';
	import RailDataInfoNote from './RailDataInfoNote.svelte';
	import NetworkRailAttribution from './NetworkRailAttribution.svelte';
	import helloKitty from '$lib/images/lol.gif';

	interface OperatorPerformance {
		code: string;
		name: string;
		on_time: number;
		late: number;
		cancelled_or_very_late: number;
		total: number;
		on_time_percentage: number;
		late_percentage: number;
		cancelled_or_very_late_percentage: number;
		performance_score: number;
	}

	interface RailData {
		on_time: number;
		cancelled_or_very_late: number;
		late: number;
		total: number;
		on_time_percentage: number;
		cancelled_or_very_late_percentage: number;
		late_percentage: number;
		best_operator: OperatorPerformance | null;
		worst_operator: OperatorPerformance | null;
	}

	let railData: RailData | null = null;
	let isConnected: boolean = false;
	let error: string | null = null;
	let lastUpdated: Date | null = null;
	let previousData: string | null = null;

	export let wsUrl: string;

	// Format date as "Wednesday, 23 October 2024"
	const today = new Date().toLocaleDateString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	// Format time as "14:32:45"
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
	}

	const performanceDescription = `
        Performance scores are calculated using a weighted formula:
        • On-time trains contribute positively to the score
        • Cancelled or very late trains count 2× against performance
        • Late trains count 1× against performance
        • Final score is between 0-100, where:
          - 100 is perfect (all trains on time)
          - 0 is worst (all trains cancelled/very late)
    `.trim();

	onMount(() => {
		if (!wsUrl) {
			error = 'WebSocket URL is undefined';
			return;
		}

		const socket: WebSocket = new WebSocket(wsUrl);

		socket.onopen = () => {
			console.log('WebSocket connected');
			isConnected = true;
			error = null;
		};

		socket.onmessage = (e: MessageEvent) => {
			try {
				const newData = e.data;
				// Only update if the data has actually changed
				if (newData !== previousData) {
					railData = JSON.parse(newData) as RailData;
					lastUpdated = new Date();
					previousData = newData;
				}
			} catch (err) {
				console.error('Error parsing WebSocket message:', err);
				error = 'Error processing data from server';
			}
		};

		socket.onclose = (event: CloseEvent) => {
			console.log('WebSocket disconnected', event.code, event.reason);
			isConnected = false;
			error = 'Connection to server lost';
		};

		socket.onerror = (err: Event) => {
			console.error('WebSocket error:', err);
			error = 'Error connecting to server';
		};

		return () => {
			socket.close();
		};
	});

	function formatPercentage(value: number): string {
		return value.toFixed(1) + '%';
	}

	function getScoreColor(score: number): string {
		if (score >= 90) return 'text-green-600';
		if (score >= 80) return 'text-emerald-600';
		if (score >= 70) return 'text-yellow-600';
		if (score >= 60) return 'text-orange-600';
		return 'text-red-600';
	}
</script>

<style>
    .explanation-box {
        @apply bg-blue-50 p-4 rounded-lg mt-4 text-sm text-blue-800 leading-relaxed;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .stat-value {
        @apply text-3xl font-bold text-blue-600;
    }

    .stat-label {
        @apply text-xl font-semibold mb-2;
    }

    .stat-percentage {
        @apply text-lg text-gray-600;
    }
</style>

<div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">

	<div class="w-64 mb-4">
        <img
            src="{helloKitty}"
            alt="Animated GIF"
            class="w-full h-auto bg-transparent"
        />
    </div>


	<div class="text-center mb-4">
		<h1 class="text-3xl font-bold mb-2">
			Realtime National Passenger Train Stats
		</h1>
		<p class="text-lg text-gray-600">{today}</p>
		{#if lastUpdated}
			<p class="text-sm text-gray-500">Last updated: {formatTime(lastUpdated)}</p>
		{/if}
	</div>

	<p class="mb-4 text-lg">
		Connection status:
		<span class={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? 'Connected' : 'Disconnected'}
        </span>
	</p>

	{#if error}
		<p class="text-red-600 mb-4">{error}</p>
	{/if}

	{#if railData}
		<div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl space-y-8">
			<!-- Overall Stats -->
			<div class="grid grid-cols-4 gap-4">
				<div class="text-center">
					<h2 class="stat-label">On Time</h2>
					<p class="stat-value">{railData.on_time}</p>
					<p class="stat-percentage">{formatPercentage(railData.on_time_percentage)}</p>
				</div>
				<div class="text-center">
					<h2 class="stat-label">Cancelled / V Late</h2>
					<p class="stat-value">{railData.cancelled_or_very_late}</p>
					<p class="stat-percentage">{formatPercentage(railData.cancelled_or_very_late_percentage)}</p>
				</div>
				<div class="text-center">
					<h2 class="stat-label">Late</h2>
					<p class="stat-value">{railData.late}</p>
					<p class="stat-percentage">{formatPercentage(railData.late_percentage)}</p>
				</div>
				<div class="text-center">
					<h2 class="stat-label">Total</h2>
					<p class="stat-value">{railData.total}</p>
				</div>
			</div>

			<!-- Operator Performance -->
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-8">
					{#if railData.best_operator}
						<div class="bg-green-50 p-6 rounded-lg">
							<h3 class="text-xl font-semibold mb-4 text-green-700">Best Performing Operator</h3>
							<div class="space-y-2">
								<p class="text-lg font-bold text-green-800">{railData.best_operator.name}</p>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-sm text-green-600">On Time</p>
										<p class="font-semibold">{formatPercentage(railData.best_operator.on_time_percentage)}</p>
									</div>
									<div>
										<p class="text-sm text-green-600">Late</p>
										<p class="font-semibold">{formatPercentage(railData.best_operator.late_percentage)}</p>
									</div>
									<div>
										<p class="text-sm text-green-600">Cancelled/V Late</p>
										<p class="font-semibold">{formatPercentage(railData.best_operator.cancelled_or_very_late_percentage)}</p>
									</div>
									<div>
										<p class="text-sm text-green-600">Total Trains</p>
										<p class="font-semibold">{railData.best_operator.total}</p>
									</div>
								</div>
								<p class="text-sm font-medium mt-2">
									Performance Score:
									<span class={getScoreColor(railData.best_operator.performance_score)}>
										{railData.best_operator.performance_score.toFixed(1)}/100
									</span>
								</p>
							</div>
						</div>
					{/if}

					{#if railData.worst_operator}
						<div class="bg-red-50 p-6 rounded-lg">
							<h3 class="text-xl font-semibold mb-4 text-red-700">Worst Performing Operator</h3>
							<div class="space-y-2">
								<p class="text-lg font-bold text-red-800">{railData.worst_operator.name}</p>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-sm text-red-600">On Time</p>
										<p class="font-semibold">{formatPercentage(railData.worst_operator.on_time_percentage)}</p>
									</div>
									<div>
										<p class="text-sm text-red-600">Late</p>
										<p class="font-semibold">{formatPercentage(railData.worst_operator.late_percentage)}</p>
									</div>
									<div>
										<p class="text-sm text-red-600">Cancelled/V Late</p>
										<p class="font-semibold">{formatPercentage(railData.worst_operator.cancelled_or_very_late_percentage)}</p>
									</div>
									<div>
										<p class="text-sm text-red-600">Total Trains</p>
										<p class="font-semibold">{railData.worst_operator.total}</p>
									</div>
								</div>
								<p class="text-sm font-medium mt-2">
									Performance Score:
									<span class={getScoreColor(railData.worst_operator.performance_score)}>
										{railData.worst_operator.performance_score.toFixed(1)}/100
									</span>
								</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Performance Calculation Explanation -->
				<div class="explanation-box">
					<h4 class="font-semibold mb-2">How is performance calculated?</h4>
					<p class="whitespace-pre-line">{performanceDescription}</p>
					<p class="mt-2 text-xs">
						Note: Operators must have at least 10 trains in service to be included in performance rankings.
					</p>
				</div>
			</div>
		</div>
	{:else}
		<p class="text-xl">Waiting for data...</p>
	{/if}

	<RailDataInfoNote />
	<NetworkRailAttribution />
</div>