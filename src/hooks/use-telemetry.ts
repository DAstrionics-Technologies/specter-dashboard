import { useReducer, useEffect } from "react";
import type { TelemetryData, ConnectionStatus } from "@/types/telemetry";

interface TelemetryState {
    data: TelemetryData | null;
    status: ConnectionStatus;
    error: string | null;
}

const initialState: TelemetryState = {
    data: null,
    status: "connecting",
    error: null,
}

type TelemetryAction =
    | { type: "MESSAGE"; payload: TelemetryData }
    | { type: "OPEN" }
    | { type: "ERROR"; payload: string };

function reducer(state: TelemetryState, action: TelemetryAction): TelemetryState {
    switch (action.type) {
        case "OPEN":
            return { ...state, status: "connected", error: null }
        case "MESSAGE":
            return { ...state, data: action.payload, status: "connected", error: null }
        case "ERROR":
            return { ...state, status: "error", error: action.payload }
    }
}

export function useTelemetry(drone_id: string) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const sseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stream/telemetry?drone_id=${drone_id}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => {
            dispatch({ type: "OPEN" })
        };
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            dispatch({ type: "MESSAGE", payload: data })
        }
        eventSource.onerror = () => {
            dispatch({ type: "ERROR", payload: "Connection lost" })
        }
        return () => {
            eventSource.close();
        }
    }, [drone_id])

    return state
}