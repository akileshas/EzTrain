"use client";

import { useEffect, useRef, useState } from "react";

const Camera = ({ className, onCapture }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [recording, setRecording] = useState<boolean>(false);

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true })
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			})
			.catch((err) => console.error("Error accessing webcam:", err));

		return () => {
			if (videoRef.current?.srcObject) {
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop());
			}
		};
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (recording) {
			interval = setInterval(() => {
				if (videoRef.current && canvasRef.current) {
					const canvas = canvasRef.current;
					const ctx = canvas.getContext("2d");
					if (ctx) {
						ctx.drawImage(videoRef.current, 0, 0, 224, 224);
						const dataUrl = canvas.toDataURL("image/png");

						// Pass captured image to parent component
						onCapture(className, dataUrl);
					}
				}
			}, 100);
		}
		return () => clearInterval(interval);
	}, [recording, className, onCapture]);

	return (
		<div className="flex flex-col items-center">
			<video ref={videoRef} autoPlay playsInline className="w-28 h-28 border-2 border-gray-400 rounded-lg object-cover" />
			<canvas ref={canvasRef} width={224} height={224} className="hidden"></canvas>

			<div className="mt-4">
				<button
					onMouseDown={() => setRecording(true)}
					onMouseUp={() => setRecording(false)}
					onTouchStart={() => setRecording(true)}
					onTouchEnd={() => setRecording(false)}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
				>
					Record (Hold)
				</button>
			</div>
		</div>
	);
};

export default Camera;
