import { Worker } from "worker_threads";

export class PoolWorkers {
    private readonly workers: Worker[] = [];
    private pendingPromises: { [id: number]: { resolve: (value: unknown) => void, reject: (value: {}) => void; }; } = {};


    constructor(src: string, instances: number) {
        for (let index = 0; index < instances; index++) {
            const worker = new Worker(src, { "workerData": { id: index } });

            worker.on("message", (data: { id: number; } & ({ type: "response", response: any; } | { type: "error", error: Error; })) => {
                if (data.type === "response") {
                    this.pendingPromises[data.id].resolve(data.response);
                    delete this.pendingPromises[data.id];
                } else {
                    this.pendingPromises[data.id].reject(data.error);
                    delete this.pendingPromises[data.id];
                }
            });

            this.workers.push(worker);
        }
    }


    sendMessage(message: any) {
        const id = Math.trunc(Math.random() * 10000);

        this.workers[Math.trunc(Math.random() * this.workers.length)].postMessage({ message, id });

        return new Promise((resolve, reject) => {
            this.pendingPromises[id] = { resolve, reject };
        });

    }

}