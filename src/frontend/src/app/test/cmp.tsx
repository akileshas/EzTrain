'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
	ReactFlowProvider,
	Handle,
	Position,
	Node,
	Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Camera from '../train/image/Camera';

const ClassNode = ({ data }: { data: { label: string } }) => (
	<div className="bg-white border shadow-md rounded-lg px-6 py-4 text-center relative">
		<Handle type="source" position={Position.Right} />
		<div className="font-bold mb-2">{data.label}</div>
		<Camera className={"nodrag"} /> {/* Embedded Camera component */}
	</div>
);

const TrainingNode = ({ data }: { data: { label: string } }) => (
	<div className="bg-white border shadow-md rounded-lg px-6 py-4 text-center relative">
		<Handle type="target" position={Position.Left} />
		<div className="font-bold">{data.label}</div>
	</div>
);

export default function Sriram() {
	const nodeTypes = useMemo(() => ({
		class: ClassNode,
		training: TrainingNode,
	}), []);

	const [nodes, setNodes] = useState<Node[]>([
		{ id: '1', type: 'class', data: { label: 'Class 1' }, position: { x: 300, y: 250 } },
		{ id: 'training', type: 'training', data: { label: 'Training' }, position: { x: 600, y: 250 } },
	]);

	const [edges, setEdges] = useState<Edge[]>([{ id: 'e1-training', source: '1', target: 'training' }]);
	const [nodeCount, setNodeCount] = useState(1);

	const updateClassPositions = (newNodeCount: number) => {
		const spacing = 120; // Space between nodes
		const startY = 250 - ((newNodeCount - 1) * spacing) / 2; // Center the nodes

		return Array.from({ length: newNodeCount }, (_, i) => ({
			id: (i + 1).toString(),
			type: 'class',
			data: { label: `Class ${i + 1}` },
			position: { x: 300, y: startY + i * spacing },
		}));
	};

	const addNode = useCallback(() => {
		const newNodeCount = nodeCount + 1;
		const updatedClassNodes = updateClassPositions(newNodeCount);
		const trainingNode = nodes.find((node) => node.id === 'training')!;

		const newEdges = updatedClassNodes.map((node) => ({
			id: `e${node.id}-training`,
			source: node.id,
			target: 'training',
			sourceHandle: 'right',
			targetHandle: 'left',
		}));

		setNodes([...updatedClassNodes, trainingNode]);
		setEdges(newEdges);
		setNodeCount(newNodeCount);
	}, [nodeCount, nodes]);

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center">
			<button
				onClick={addNode}
				className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Add Class
			</button>

			<div className="w-full h-[80vh] border rounded shadow-lg">
				<ReactFlowProvider>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						panOnDrag={true}
						zoomOnScroll={true}
						zoomOnPinch={true}
						nodesDraggable={false}
						nodesConnectable={false}
						fitView
					/>
				</ReactFlowProvider>
			</div>
		</div>
	);
}
