
"use client";

import AudioRecorder from "./AudioRecorder";
import React, { useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

type DatasetBlock = {
	id: number;
	option: "upload" | "record" | null;
	className: string;
};

export default function DatasetPage() {
	const [datasetBlocks, setDatasetBlocks] = useState<DatasetBlock[]>([
		{ id: 1, option: null, className: "class 1" },
		{ id: 2, option: null, className: "class 2" },
	]);
	const [classAudios, setClassAudios] = useState<Record<string, string[]>>({});
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);
	const socketRef = useRef<Socket | null>(null);
	const [modelAvailable, setModelAvailable] = useState(false);

	// Initialize socket connection
	if (!socketRef.current) {
		socketRef.current = io("http://localhost:5000");
	}

	const addDatasetBlock = () => {
		const newId =
			datasetBlocks.length > 0
				? Math.max(...datasetBlocks.map((b) => b.id)) + 1
				: 1;
		setDatasetBlocks([
			...datasetBlocks,
			{ id: newId, option: null, className: `class ${newId}` },
		]);
	};

	const setBlockOption = (id: number, option: "upload" | "record") => {
		setDatasetBlocks(
			datasetBlocks.map((block) =>
				block.id === id
					? { ...block, option }
					: { ...block, option: block.option === "record" ? null : block.option }
			)
		);
	};

	const handleCapture = (className: string, audioData: string) => {
		setClassAudios((prev) => ({
			...prev,
			[className]: [...(prev[className] || []), audioData],
		}));
	};

	const handleUpload = (
		className: string,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!event.target.files) return;
		const files = Array.from(event.target.files);
		const newAudios = files.map((file) => URL.createObjectURL(file));

		setClassAudios((prev) => ({
			...prev,
			[className]: [...(prev[className] || []), ...newAudios],
		}));
	};

	const handleTrainModel = () => {
		if (Object.keys(classAudios).length === 0) {
			alert("No audio captured for training.");
			return;
		}
		socketRef.current?.emit("train_model", classAudios);
		alert("Training started!");
		setModelAvailable(true);
		console.log(modelAvailable);
	};

	// Placeholder download function
	const handleDownload = () => {
		alert("Download started!");
		setIsExportModalOpen(false);
	};

	return (
		<div className="relative min-h-screen bg-gray-50 py-48 flex flex-col items-start">
			<div className="mx-[20%] flex flex-col text-black md:flex-row gap-12 items-start">
				{/* Left Part: Dataset Blocks */}
				<div className="flex-grow space-y-4 w-[500px]">
					{datasetBlocks.map((block) => (
						<div
							key={block.id}
							className="dataset-block bg-white p-4 rounded shadow border text-center"
						>
							<input
								type="text"
								placeholder="Enter class name"
								value={block.className}
								onChange={(e) => {
									const newName = e.target.value;
									setDatasetBlocks(
										datasetBlocks.map((b) =>
											b.id === block.id ? { ...b, className: newName } : b
										)
									);
								}}
								className="px-2 py-1 w-64 mb-4 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
							/>

							<div className="flex justify-center space-x-4 mb-4">
								<label
									className={`px-4 py-2 rounded transition cursor-pointer ${
										block.option === "upload"
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-800"
									}`}
								>
									<input
										type="file"
										accept="audio/*"
										multiple
										className="hidden"
										onChange={(e) => handleUpload(block.className, e)}
									/>
									Upload Audio
								</label>

								<button
									onClick={() => setBlockOption(block.id, "record")}
									className={`px-4 py-2 rounded transition ${
										block.option === "record"
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-800"
									}`}
								>
									Record Audio
								</button>
							</div>

							{/* Show Audio Recorder if selected */}
							{block.option === "record" && (
								<AudioRecorder
									className={block.className}
									onCapture={handleCapture}
								/>
							)}

							{/* Show Captured & Uploaded Audio */}
							<div className="mt-4 w-full h-28 bg-gray-100 border border-gray-400 rounded p-2 overflow-y-auto flex flex-wrap gap-1">
								{classAudios[block.className]?.map((audio, index) => (
									<audio key={index} controls src={audio} className="w-40" />
								))}
							</div>

							<p className="mt-2 text-gray-600">
								Total Audio Clips: {classAudios[block.className]?.length || 0}
							</p>
						</div>
					))}

					<button
						onClick={addDatasetBlock}
						className="w-full h-20 border-2 border-dotted border-gray-300 rounded flex items-center justify-center text-gray-700 font-semibold hover:text-blue-600 hover:border-blue-600 transition"
					>
						Add Class
					</button>
				</div>

				{/* Right Part: Fixed Training & Preview */}
				<div className="fixed right-40 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-8 bg-white p-4 shadow-lg rounded-lg">
					<h3 className="text-xl font-bold">Preview Before Training</h3>

					{/* Audio Preview Section */}
					<div className="w-72 h-72 overflow-y-auto border border-gray-400 rounded p-2 bg-gray-100">
						{Object.entries(classAudios).map(([className, audios]) => (
							<div key={className} className="mb-4">
								<h4 className="font-semibold text-gray-800 mb-2">{className}</h4>
								<div className="flex flex-wrap gap-1">
									{audios.map((audio, index) => (
										<audio key={index} controls src={audio} className="w-10" />
									))}
								</div>
							</div>
						))}
					</div>

					<button
						onClick={handleTrainModel}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
					>
						Train Model
					</button>
					<div className="bg-white p-4 rounded shadow flex flex-col items-center">
						<h3 className="text-xl font-bold mb-4">Export</h3>
						<button
							onClick={() => setIsExportModalOpen(true)}
							className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
							disabled={!modelAvailable}
						>
							Export Model
						</button>
						<p className="mt-4 text-sm text-gray-600 text-center">
							You must train a model on the left before you can preview it here.
						</p>
					</div>
				</div>
			</div>

			{/* Export Modal */}
			{isExportModalOpen && (
				<div className="fixed inset-0 flex items-center text-black justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded shadow-lg">
						<h3 className="text-xl font-bold mb-4">Export Model</h3>
						<p className="mb-4">
							Your model export is ready. Click download to save your model.
						</p>
						<div className="flex justify-end">
							<button
								onClick={handleDownload}
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
							>
								Download
							</button>
							<button
								onClick={() => setIsExportModalOpen(false)}
								className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
