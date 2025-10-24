/**
 * Video Player Component
 * 
 * Video player based on video-react wrapper, supports custom poster, autoplay, mute and other features
 * 
 * Usage example:
 * <Video
 *   src="" // Video resource URL, defaults to empty string
 *   poster="https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png" // Video poster image
 * />
 */

import {
    BigPlayButton,
    ControlBar,
    PlayToggle,
    CurrentTimeDisplay,
    TimeDivider,
    DurationDisplay,
    FullscreenToggle,
    VolumeMenuButton,
    ProgressControl
} from 'video-react';
import 'video-react/dist/video-react.css';

interface VideoProps {
    /** Video resource URL */
src: string;
poster?: string; /** Video poster image URL */
className?: string; /** Custom class name */
autoPlay?: boolean; /** Whether to autoplay, defaults to false */
muted?: boolean; /** Whether to mute, defaults to false */
controls?: boolean; /** Whether to show controls, defaults to true */
aspectRatio?: string | 'auto' | '16:9' | '4:3'; /** Video aspect ratio, defaults to 'auto' */
}

export default function Video({
className,
src,
poster,
autoPlay = false,
muted = false,
controls = true,
aspectRatio = 'auto'
}: VideoProps) {
return (
    <div className={`min-w-[100px] ${className}`} custom-component="video">
    <style>
        {`
.video-react-paused .video-react-big-play-button.big-play-button-hide {
    display: block;
}

.video-react .video-react-big-play-button {
    width: 48px;
    height: 40px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    margin-left: -24px !important;
    margin-top: -20px !important;
    background: rgba(7, 12, 20, 0.6) !important;
}

.video-react .video-react-big-play-button:hover {
    background: rgba(7, 12, 20, 0.8) !important;
}

.video-react .video-react-big-play-button:before {
display: block;
    content: '';
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqCAYAAADBNhlmAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGVSURBVHgB7ZnhbYMwEIWPqAN0BHcDRiAbdASyQTpB6QRpJyAjdAO8QbsBbNBs4L6TcYtaUADb      +H7kk56cgKJ8sX0RHBmNYIwpMBT92w7RWZZ1lBoWQ1rzny/kGbmnVODLc3OdFikpBWZ85mSI9ku7htbY/RqNXT8WtA6FNJCsEUUR2FEYSqSNIRpK0FGSFT2FEg0t6DiSXfojeRJLkFHIybfiYwo6FFKvFd1C0KHIijZL9ueWgo6CFlR8CkFHSTNEUwo6SuTDTFyMSBBkWKwiK1oOT0gRdCj6rXh+LU7QocjOppIqyPCy15IFmUK6oNg9      +MNN0BMtWfCCHKQKdsiemwXSBHnWniD2gHzygTuSAYu9Ia8QuwxPSBBkseqvmCOloEYO15pSKfagJlsA+zkdsy1nUCMvkNJLPrSFYEdW7EwriCk4WZlLiCEYRMwRWvBMdjk7CoQT9P2lmlYUwGw8GphN7AbmULJdINZuJjYQnDOL3O33bqn5SOZm+jFEZRI8hsjGDkLkEUNO9taPL3veQ/xlrOEbeloBZoEUypwAAAAASUVORK5CYII=)
    no-repeat;
    background-size: contain;
    width: 15px;
    height: 16.25px;
    margin: 0 auto;
    position: relative;
}

.h-full > .video-react.video-react-fluid {
    height: 100%;
    padding-top: 0 !important;
    aspect-ratio: 16 / 9;
}
`}
    </style>
    <Player
        poster={poster}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        aspectRatio={aspectRatio}
    >
        <ControlBar
        disableDefaultControls
        autoHide
        disableCompletely={!controls}
        >
        <PlayToggle key="play-toggle" />
        <VolumeMenuButton key="volume-menu-button" vertical />
        <CurrentTimeDisplay key="current-time-display" />
        <TimeDivider key="time-divider" />
        <DurationDisplay key="duration-display" />
        <ProgressControl key="progress-control" />
        <FullscreenToggle key="fullscreen-toggle" />
        </ControlBar>
        <BigPlayButton position="center" />
    </Player>
    </div>
);
}