import { useReducer, useEffect } from "react";
import type { TelemetryData, ConnectionStatus } from "@/types/telemetry";

// Operator wants to see the last known frame on a flap, not "--".
// 5s tolerates normal cellular jitter; longer than that we flip to STALE.
const STALE_THRESHOLD_MS = 5_000;
const FRESHNESS_CHECK_INTERVAL_MS = 1_000;

interface TelemetryState {
    data: TelemetryData | null;
    status: ConnectionStatus;
    lastReceivedAt: number | null;
    error: string | null;
}

const initialState: TelemetryState = {
    data: null,
    status: "connecting",
    lastReceivedAt: null,
    error: null,
}

type TelemetryAction =
    | { type: "MESSAGE"; payload: TelemetryData; receivedAt: number }
    | { type: "OPEN" }
    | { type: "TICK"; now: number }
    | { type: "ERROR"; payload: string };

function reducer(state: TelemetryState, action: TelemetryAction): TelemetryState {
    switch (action.type) {
        case "OPEN":
            return { ...state, status: "connected", error: null }
        case "MESSAGE":
            return {
                ...state,
                data: action.payload,
                status: "connected",
                lastReceivedAt: action.receivedAt,
                error: null,
            }
        case "TICK":
            if (state.status !== "connected") return state;
            if (state.lastReceivedAt === null) return state;
            return action.now - state.lastReceivedAt > STALE_THRESHOLD_MS
                ? { ...state, status: "stale" }
                : state;
        case "ERROR":
            // Hold the last frame instead of wiping it. Components dim the
            // values so the operator can see what we last knew.
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
            dispatch({ type: "MESSAGE", payload: data, receivedAt: Date.now() })
        }
        eventSource.onerror = () => {
            dispatch({ type: "ERROR", payload: "Connection lost" })
        }

        const freshnessTimer = setInterval(() => {
            dispatch({ type: "TICK", now: Date.now() })
        }, FRESHNESS_CHECK_INTERVAL_MS)

        return () => {
            clearInterval(freshnessTimer);
            eventSource.close();
        }
    }, [drone_id])

    return state
}
