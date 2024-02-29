import { parentPort, workerData } from "worker_threads";

parentPort?.on("message", (data: any) => {

    setTimeout(() => {
        try {
            parentPort?.postMessage({ response: "response from WORKER " + (workerData.id + 1), id: data.id, type: "response" });
        } catch (error) {
            parentPort?.postMessage({ error, id: data.id, type: "error" });
        }
    }, Math.random() * 1000);
});