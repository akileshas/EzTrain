
'use client';

import Camera from './Camera';
import React, { useState, useEffect, useRef } from 'react';


export default function DatasetPage() {
	const [datasetBlocks, setDatasetBlocks] = useState<String>("");

	const [className, setClassName] = useState<string>("class ");
	const setBlockOption = (option: 'upload' | 'webcam') => {
		setDatasetBlocks(option);
	};

	return (
			<div className="flex space-y-4 w-[300px]  " >
				<div
					className="dataset-block bg-white  text-center"
				>
					<input
						type="text"
						placeholder="Enter class name"
						value={className}
						onChange={(e) => setClassName(e.target.value)}
						className="px-2 py-1 w-64 mb-4 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
					/>
					<div className="flex justify-center space-x-4 mb-4">
						<button
							onClick={() => setBlockOption('upload')}
							className={`px-4 py-2 rounded transition ${datasetBlocks === 'upload'
								? 'bg-blue-600 text-white'
								: 'bg-gray-200 text-gray-800'
								}`}
						>
							Upload
						</button>
						<button
							onClick={() => setBlockOption('webcam')}
							className={`px-4  rounded transition ${datasetBlocks === 'webcam'
								? 'bg-blue-600 text-white'
								: 'bg-gray-200 text-gray-800'
								}`}
						>
							Webcam
						</button>
					</div>
					{datasetBlocks === 'upload' && (
						<div>
							<input type="file" multiple className="border  w-full" />
						</div>
					)}
					{datasetBlocks === 'webcam' && (
						<div className="border ">
							{/* Render the Camera component only for the active webcam block */}
							<Camera className={className} />
						</div>
					)}
				</div>
			</div>

	);
	{/* Right Part: Fixed Training & Preview 
				<div className="fixed right-56 top-1/2 transform -translate-y-1/2 flex flex-row items-center gap-4">
					<div
						className="bg-white p-4 rounded shadow flex flex-col items-center"
						ref={trainDivRef}
					>
						<h3 className="text-xl font-bold mb-4">Training</h3>
						<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
							Train Model
						</button>
					</div>
					<div
						className="bg-white p-4 rounded shadow flex flex-col items-center"
						ref={previewDivRef}
					>
						<h3 className="text-xl font-bold mb-4">Preview</h3>
						<button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
							Export Model
						</button>
						<p className="mt-4 text-sm text-gray-600 text-center">
							You must train a model on the left before you can preview it here.
						</p>
					</div>
				</div>
			</div>
		</div>
						*/}
}

