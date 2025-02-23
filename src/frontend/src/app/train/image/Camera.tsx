"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const Camera = ({ className }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [recording, setRecording] = useState<boolean>(false);
	const [capturedImages, setCapturedImages] = useState<string[]>([]);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [reccing, setReccing] = useState<Boolean>(false);

	useEffect(() => {
		// Change this URL to the address and port where your Flask server is running.
		const newSocket: Socket = io("http://localhost:5000");
		setSocket(newSocket);

		navigator.mediaDevices.getUserMedia({ video: true })
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			})
			.catch((err) => console.error("Error accessing webcam:", err));

		return () => {
			newSocket.close();
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
						setCapturedImages((prev) => [...prev, dataUrl]);
					}
				}
			}, 100);
		}
		return () => clearInterval(interval);
	}, [recording]);

	const handleRecordMouseDown = () => setRecording(true);
	const handleRecordMouseUp = () => setRecording(false);

	const handleSend = () => {
		if (!className) {
			alert("Please enter a class name.");
			return;
		}
		if (socket) {
			socket.emit("upload_images", { images: capturedImages, class: className });
			setCapturedImages([]);
		}
	};

	return (
		<div className="flex w-full gap-2  items-center justify-center  p-6 bg-gray-900 text-white">
			<div >
				<h1 className="text-3xl font-bold mb-6"> Image Capture</h1>
				<div className="flex flex-col items-center">
					<video
						ref={videoRef}
						autoPlay
						playsInline
						className="w-28 h-28 border-2 border-gray-400 rounded-lg object-cover"
					></video>
					<canvas ref={canvasRef} width={224} height={224} className="hidden"></canvas>
				</div>

				<div className="mt-6 flex flex-col items-center space-y-4">
					<div className="flex gap-4">
						<button
							onMouseDown={handleRecordMouseDown}
							onMouseUp={handleRecordMouseUp}
							onTouchStart={handleRecordMouseDown}
							onTouchEnd={handleRecordMouseUp}
							onClick={() => {
								reccing ? handleRecordMouseUp() : handleRecordMouseDown();
								setReccing(prev => !prev)
							}}
							className={`nodrag px-4 py-2  rounded-lg shadow transition ${reccing ? "bg-red-600":"bg-blue-600"}`}
						>
							{!reccing ? "Record" : "Stop"}
						</button>
						<button
							onClick={handleSend}
							className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg shadow transition nodrag"
						>
							Send
						</button>
					</div>


				</div>
			</div>
			<div>
				<div className="mt-6 w-52  h-52 bg-gray-800 border border-gray-600 rounded p-2 overflow-y-auto flex flex-wrap gap-1">
					{capturedImages.map((img, index) => (
						<img
							key={index}
							src={img}
							alt={`Captured ${index}`}
							className="w-10 h-10 object-cover rounded"
						/>
					))}
				</div>

				<p className="mt-4 text-gray-300">Captured Images: {capturedImages.length}</p>
			</div>
		</div>
	);
};
export default Camera;
