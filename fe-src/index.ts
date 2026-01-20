import { state, initState } from './state';
import { initRouter } from './router';

declare global {
    interface Window {
        mapboxgl: any;
    }
}

async function main() {
    await initState();
    initRouter();
}

main();
