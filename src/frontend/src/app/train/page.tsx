'use client';

import { useRouter } from 'next/navigation';

export default function CardPopupPage() {
	const router = useRouter();

	const handleOptionClick = (option: string) => {
		console.log("hi");
		if(option === "Image") router.push(`/train/image`);
		if(option === "Audio") router.push(`/train/audio`);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 p-4">
			<h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-md">
				New Project
			</h1>
			<p className="text-lg text-gray-600 max-w-xl text-center">
				Welcome to the project builder! Here, you can choose between creating an image-based project or an audio-based project. 
				Select the option that best fits your needs, and we'll guide you through the process of training your custom model.
			</p>
			<div className="flex space-x-8">
				{/* Card 1 */}
				<div
					className="w-64 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-100"
					onClick={() => handleOptionClick("Image")}
				>
					<span className="text-2xl font-bold text-gray-700">Image Project</span>
				</div>
				{/* Card 2 */}
				<div
					className="w-64 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-100"
					onClick={() => handleOptionClick("Audio")}
				>
					<span className="text-2xl font-bold text-gray-700">Audio Project</span>
				</div>
			</div>
		</div>
	);
}
