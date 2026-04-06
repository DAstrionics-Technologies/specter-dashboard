"use client"

import { useEffect, useRef } from "react"
import Hls from "hls.js"

interface VideoPlayerProps {
    droneId: string;
}

export default function VideoPlayer({ droneId }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return;

        const streamUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/live/${droneId}.m3u8`;

        if (Hls.isSupported()) {
            const hls = new Hls({
                // How often to poll the playlist for new segments
                liveSyncDurationCount: 3,        // stay 3 segments behind live edge (default)
                liveMaxLatencyDurationCount: 6,  // if >6 segments behind, skip to live

                // Retry behavior
                manifestLoadingMaxRetry: 6,      // retry fetching playlist 6 times
                manifestLoadingRetryDelay: 1000, // wait 1s between retries
                levelLoadingMaxRetry: 6,         // retry fetching quality levels
                levelLoadingRetryDelay: 1000,
                fragLoadingMaxRetry: 6,          // retry fetching video segments
                fragLoadingRetryDelay: 1000,

                // Backoff — doubles delay each retry up to this cap
                manifestLoadingMaxRetryTimeout: 30000,  // max 30s between retries
                levelLoadingMaxRetryTimeout: 30000,
                fragLoadingMaxRetryTimeout: 30000,

                // Low latency tuning
                lowLatencyMode: true,            // fetch segments as they're written
                backBufferLength: 30,            // keep 30s of played video in buffer
            })
            hls.loadSource(streamUrl)
            hls.attachMedia(video)
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(() => { });
            })
            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }

                }
            })

            return () => {
                hls.destroy();
            }
        }

        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl

            const onCanPlay = () => video.play();
            video.addEventListener('canplay', onCanPlay);

            return () => {
                video.removeEventListener('canplay', onCanPlay);
                video.src = '';
            }
        }
    }, [droneId]);

    return (
        <video
            ref={videoRef}
            controls
            muted
        // style={{ width: "100%", maxHeight: "480px" }}        
        />
    )
}