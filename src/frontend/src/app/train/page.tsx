
'use client';

import { useRouter } from 'next/navigation';

export default function CardPopupPage() {
	const router = useRouter();


	const handleOptionClick = (option: string) => {
		console.log("hi")
		if(option==="Image")router.push(`/train/image`);
		if(option==="Audio") router.push(`/train/audio`);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gray-50 p-4">
			<h1 className="text-3xl font-bold">New Project</h1>
			<div className="flex space-x-8">
				{/* Card 1 */}
				<div
					className="w-64 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
					onClick={() => handleOptionClick("Image")}
				>
					<span className="text-xl font-semibold">Image Project</span>
				</div>
				{/* Card 2 */}
				<div
					className="w-64 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
					onClick={() => handleOptionClick("Audio")}
				>
					<span className="text-xl font-semibold">Audio Project</span>
				</div>
			</div>

		</div>
	);
}
