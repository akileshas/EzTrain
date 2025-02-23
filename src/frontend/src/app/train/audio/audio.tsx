"use client";

import { useEffect, useRef, useState } from "react";

const Microphone = () => {
	const [recording, setRecording] = useState<boolean>(false);
	const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [audioDuration, setAudioDuration] = useState<number>(0);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [audioRecorded, setAudioRecorded] = useState<boolean>(false);

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then((stream) => {
				const recorder = new MediaRecorder(stream);
				setMediaRecorder(recorder);

				recorder.ondataavailable = (event) => {
					if (event.data.size > 0) {
						setAudioChunks((prev) => [...prev, event.data]);
					}
				};
			})
			.catch((err) => console.error("Error accessing microphone:", err));
	}, []);

	const handleRecord = () => {
		if (!recording) {
			setAudioChunks([]);
			mediaRecorder?.start();
		} else {
			mediaRecorder?.stop();
		}
		setRecording((prev) => !prev);
	};

	useEffect(() => {
		if (audioChunks.length > 0) {
			const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
			const url = URL.createObjectURL(audioBlob);
			setAudioUrl(url);
			setAudioRecorded(true);

			// Create a new audio element to determine duration
			const tempAudio = new Audio(url);
			tempAudio.addEventListener("loadedmetadata", () => {
				setAudioDuration(tempAudio.duration);
			});
		}
	}, [audioChunks]);

	const playAudio = () => {
		if (audioRef.current && audioUrl) {
			audioRef.current.src = audioUrl;
			audioRef.current.play();
		}
	};

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = parseFloat(e.target.value);
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center text-sm ">
			<h1 className="text-sm text-black font-bold mb-2">Audio Capture</h1>

			<div className="flex gap-4">
				<button
					onClick={handleRecord}
					className={`nodrag px-2 py-1 rounded-lg text-xs shadow transition ${recording ? "bg-red-600" : "bg-blue-600"}`}
				>
					{recording ? "Stop" : "Record"}
				</button>

				<button
					onClick={playAudio}
					className="px-2 py-1 bg-yellow-600 text-xs hover:bg-yellow-700 rounded-lg shadow transition nodrag"
					disabled={!audioUrl}
				>
					Play
				</button>

			</div>

			{/* Show "Recording..." while recording, else show the progress bar */}
			{recording ? (
				<div className="mt-4 text-xs font-semibold text-red-500">Recording...</div>
			) : (
				audioRecorded && (
					<div className="  w-xs mt-2">
						<input
							type="range"
							min="0"
							max={audioDuration}
							value={currentTime}
							step="0.1"
							onChange={handleSeek}
							className="w-xs"
						/>
						<div className="text-center text-xs mt-1">
							{Math.floor(currentTime)}s / {Math.floor(audioDuration)}s
						</div>
					</div>
				)
			)}

			<audio
				ref={audioRef}
				controls
				className="mt-2 hidden"
				onTimeUpdate={handleTimeUpdate}
			></audio>
		</div>
	);
};

export default Microphone;
