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
import Microphone from './audio';
import Train from './Train';

const ClassNode = ({ data }: { data: { label: string } }) => (
	<div className="bg-white border shadow-md rounded-lg px-4 py-2 text-center relative">
		<Handle type="source" position={Position.Right} />
		<div className="font-bold text-md text-black">{data.label}</div>
		<Microphone />
	</div>
);

const TrainingNode = ({ data }: { data: { label: string } }) => (
	<div className="bg-white border shadow-md rounded-lg px-6 py-4 text-center relative">
		<Handle type="target" position={Position.Left} />
		<Handle type="source" position={Position.Right} />
		<Train />
	</div>
);

const PreviewNode = ({ data }: { data: { label: string } }) => (
	<div className="bg-white border shadow-md rounded-lg px-6 py-4 text-center relative">
		<Handle type="target" position={Position.Left} />
		<div className="font-bold">{data.label}</div>
	</div>
);

export default function Audiopage() {
	const nodeTypes = useMemo(() => ({
		class: ClassNode,
		training: TrainingNode,
		preview: PreviewNode,
	}), []);

	const [nodes, setNodes] = useState<Node[]>([
		{ id: '1', type: 'class', data: { label: 'Class 1' }, position: { x: 100, y: 250 } },
		{ id: 'training', type: 'training', data: { label: 'Training' }, position: { x: 500, y: 250 } },
		{ id: 'preview', type: 'preview', data: { label: 'Preview' }, position: { x: 800, y: 250 } }
	]);

	const [edges, setEdges] = useState<Edge[]>([
		{ id: 'e1-training', source: '1', target: 'training' }, 
		{ id: 'training-preview', source: 'training', target: 'preview' }
	]);

	const addNode = useCallback(() => {
		setNodes((prevNodes) => {
			const classNodes = prevNodes.filter((node) => node.type === 'class');
			const newNodeId = (classNodes.length + 2).toString(); // +2 because new node is added

			// Formula-based positioning
			const newY = 250 + (classNodes.length * 100); // Space nodes properly

			// New Class Node
			const newClassNode: Node = {
				id: newNodeId,
				type: 'class',
				data: { label: `Class ${newNodeId}` },
				position: { x: 100, y: newY }
			};

			// Ensure training & preview nodes stay
			const trainingNode = prevNodes.find((node) => node.id === 'training') || { 
				id: 'training', type: 'training', data: { label: 'Training' }, position: { x: 500, y: 250 } 
			};
			const previewNode = prevNodes.find((node) => node.id === 'preview') || { 
				id: 'preview', type: 'preview', data: { label: 'Preview' }, position: { x: 800, y: 250 } 
			};

			return [...prevNodes, newClassNode, trainingNode, previewNode];
		});

		setEdges((prevEdges) => {
			const classNodes = nodes.filter((node) => node.type === 'class');
			const newNodeId = (classNodes.length + 2).toString(); // +2 to match new ID

			// Create edge from new class to training
			const newEdge: Edge = {
				id: `e${newNodeId}-training`,
				source: newNodeId,
				target: 'training',
				sourceHandle: 'right',
				targetHandle: 'left'
			};

			// Ensure training -> preview edge exists
			const trainingPreviewEdge = prevEdges.find((edge) => edge.id === 'training-preview') || {
				id: 'training-preview',
				source: 'training',
				target: 'preview'
			};

			return [...prevEdges, newEdge, trainingPreviewEdge];
		});
	}, [nodes]);

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center">
			<button
				onClick={addNode}
				className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Add Class
			</button>

			<div className="w-full h-[80vh] rounded shadow-lg">
				<ReactFlowProvider>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						panOnDrag={true}
						zoomOnScroll={false}
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

