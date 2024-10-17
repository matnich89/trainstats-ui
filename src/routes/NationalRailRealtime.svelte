<script lang="ts">
    import { onMount } from 'svelte';
    import RailDataInfoNote from "./RailDataInfoNote.svelte";
    import NetworkRailAttribution from "./NetworkRailAttribution.svelte";

    interface RailData {
        on_time: number;
        cancelled_or_very_late: number;
        late: number;
        total: number;
    }

    let railData: RailData | null = null;
    let isConnected: boolean = false;
    let error: string | null = null;

    export let wsUrl: string;

    onMount(() => {
        if (!wsUrl) {
            error = "WebSocket URL is undefined";
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
                railData = JSON.parse(e.data) as RailData;
            } catch (err) {
                console.error("Error parsing WebSocket message:", err);
                error = "Error processing data from server";
            }
        };

        socket.onclose = (event: CloseEvent) => {
            console.log('WebSocket disconnected', event.code, event.reason);
            isConnected = false;
            error = "Connection to server lost";
        };

        socket.onerror = (err: Event) => {
            console.error('WebSocket error:', err);
            error = "Error connecting to server";
        };

        return () => {
            socket.close();
        };
    });
</script>

<div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <h1 class="text-3xl font-bold mb-8 text-center">
        Current Realtime National Rail Stats
    </h1>
    <p class="mb-4 text-lg">
        WebSocket URL: {wsUrl || 'Loading...'}
    </p>
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
        <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            <div class="grid grid-cols-4 gap-4">
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">On Time</h2>
                    <p class="text-3xl font-bold text-blue-600">{railData.on_time}</p>
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Cancelled or Very Late</h2>
                    <p class="text-3xl font-bold text-blue-600">{railData.cancelled_or_very_late}</p>
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Late</h2>
                    <p class="text-3xl font-bold text-blue-600">{railData.late}</p>
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Total</h2>
                    <p class="text-3xl font-bold text-blue-600">{railData.total}</p>
                </div>
            </div>
        </div>
    {:else}
        <p class="text-xl">Waiting for data...</p>
    {/if}
    <RailDataInfoNote />
    <NetworkRailAttribution />
</div>