'use client'

import dagre from 'dagre'
import { useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  useEdgesState,
  useNodesState
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Goal } from './goals.type'

const nodeWidth = 200
const nodeHeight = 40

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'LR'
) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  // 添加节点
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  // 添加边
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // 计算布局
  dagre.layout(dagreGraph)

  // 获取新的节点位置
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    }
  })

  return { nodes: layoutedNodes, edges }
}

function processGoals(goals: Goal[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const processNode = (goal: Goal, parentId?: string) => {
    // 创建节点
    nodes.push({
      id: goal.id.toString(),
      data: {
        label: goal.summary,
        description: goal.description
      },
      position: { x: 0, y: 0 }, // 位置将由 dagre 计算
      type: parentId ? 'default' : 'input',
      targetPosition: Position.Left,
      sourcePosition: Position.Right
    })

    // 如果有父节点，创建边
    if (parentId) {
      edges.push({
        id: `e${parentId}-${goal.id}`,
        source: parentId,
        target: goal.id.toString()
      })
    }

    // 处理子节点
    if (goal.children) {
      goal.children.forEach((child) => processNode(child, goal.id.toString()))
    }
  }

  goals.forEach((goal) => processNode(goal))
  return getLayoutedElements(nodes, edges)
}

export function GoalsTree({ goals }: { goals: Goal[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = processGoals(goals)
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [goals, setNodes, setEdges])

  // 初始化布局
  useEffect(() => {
    onLayout()
  }, [onLayout])

  return (
    <div className="w-full h-screen p-4">
      <div className="w-full h-full bg-white rounded-lg shadow-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          defaultEdgeOptions={{
            type: 'smoothstep'
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
