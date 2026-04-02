export interface TelemetryData {
    drone_id: string,
    lat: number,
    lon: number,
    alt: number,
    speed: number,
    battery: number,
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";