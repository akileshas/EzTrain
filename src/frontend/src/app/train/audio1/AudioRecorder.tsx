
"use client";

import { useEffect, useRef, useState } from "react";

interface AudioRecorderProps {
	className: string;
	onCapture: (className: string, audioData: string) => void;
}

const AudioRecorder = ({ className, onCapture }: AudioRecorderProps) => {
	const [recording, setRecording] = useState<boolean>(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);

	useEffect(() => {
		// Request access to the microphone
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				streamRef.current = stream;
			})
			.catch((err) => console.error("Error accessing microphone:", err));

		return () => {
			// Cleanup: stop all tracks when component unmounts
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	const startRecording = () => {
		if (streamRef.current) {
			const mediaRecorder = new MediaRecorder(streamRef.current);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.addEventListener("dataavailable", (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			});

			mediaRecorder.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
				const audioUrl = URL.createObjectURL(audioBlob);
				onCapture(className, audioUrl);
			});

			mediaRecorder.start();
			setRecording(true);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setRecording(false);
		}
	};

	return (
		<div className="flex flex-col items-center">
			<div className="mt-4">
				<button
					onMouseDown={startRecording}
					onMouseUp={stopRecording}
					onTouchStart={startRecording}
					onTouchEnd={stopRecording}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
				>
					Record (Hold)
				</button>
			</div>
			{recording && <p className="mt-2 text-sm text-red-600">Recording...</p>}
		</div>
	);
};

export default AudioRecorder;
