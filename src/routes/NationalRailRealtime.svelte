<script lang="ts">
    import "../app.css"
    import { onMount } from 'svelte';
    import RailDataInfoNote from "./RailDataInfoNote.svelte";
    import NetworkRailAttribution from "./NetworkRailAttribution.svelte";

    interface RailData {
        on_time: number;
        cancelled_or_very_late: number;
        late: number;
        total: number;
    }

    let data: RailData | null = null;
    let isConnected: boolean = false;
    let error: string | null = null;
    let wsUrl: string | null = null;

    async function fetchConfig() {
        try {
            const response = await fetch('/config.json');
            const config = await response.json();
            return config.VITE_WEBSOCKET_URL;
        } catch (err) {
            console.error("Error fetching config:", err);
            return null;
        }
    }

    onMount(async () => {
        wsUrl = await fetchConfig();
        console.log('WebSocket URL:', wsUrl);

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
                data = JSON.parse(e.data) as RailData;
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
    {#if data}
        <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            <div class="grid grid-cols-4 gap-4">
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">On Time</h2>
                    <p class="text-3xl font-bold text-blue-600">{data.on_time}</p>
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Cancelled or Very Late</h2>
                    <p class="text-3xl font-bold text-blue-600">{data.cancelled_or_very_late}</p>
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Late</h2>
                    <p class="text-3xl font-bold text-blue-600">{data.late}</p>
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Total</h2>
                    <p class="text-3xl font-bold text-blue-600">{data.total}</p>
                </div>
            </div>
        </div>
    {:else}
        <p class="text-xl">Waiting for data...</p>
    {/if}
    <RailDataInfoNote />
    <NetworkRailAttribution />
</div>