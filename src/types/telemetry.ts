export interface TelemetryData {
    drone_id: string,
    lat: number,
    lon: number,
    alt: number,
    speed: number,
    heading: number,
    battery: number,
    voltage: number,
    armed: boolean,
    flight_mode: string,
    gps_fix_type: number,
    satellites: number,
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";