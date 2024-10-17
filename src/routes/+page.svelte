<script lang="ts">
    import NationalRailRealtime from './NationalRailRealtime.svelte';
    export let data: {
        wsUrl: string;
    };
</script>

<main>
    <NationalRailRealtime wsUrl={data.wsUrl} />
</main>

<style>
    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>