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
import { Goal, LifeGoal } from '../goals.type'

const nodeWidth = 200
const nodeHeight = 40

// 基础节点样式
const nodeStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '10px',
  fontSize: '14px',
  background: '#fff'
}

// 根节点样式
const rootNodeStyle = {
  ...nodeStyle,
  background: '#e6f3ff',
  borderColor: '#1890ff'
}

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

  // 添加根节点
  const rootId = 'root'
  nodes.push({
    id: rootId,
    data: {
      label: '人生目标',
      description: '总体目标'
    },
    position: { x: 0, y: 0 },
    type: 'input',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    style: {
      ...rootNodeStyle,
      background: '#1890ff',
      color: 'white',
      borderColor: '#096dd9'
    }
  })

  const processNode = (goal: Goal, parentId: string) => {
    nodes.push({
      id: goal.id.toString(),
      data: {
        label: goal.summary,
        description: goal.description
      },
      position: { x: 0, y: 0 },
      type: 'default',
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      style: nodeStyle,
      className: 'goal-node'
    })

    // 创建与父节点的连接
    edges.push({
      id: `e${parentId}-${goal.id}`,
      source: parentId,
      target: goal.id.toString(),
      style: { stroke: '#999' }
    })

    // 处理子节点
    if (goal.children) {
      goal.children.forEach((child) => processNode(child, goal.id.toString()))
    }
  }

  // 处理所有顶层目标，将它们连接到根节点
  goals.forEach((goal) => processNode(goal, rootId))

  return getLayoutedElements(nodes, edges)
}

export function GoalsTree({
  lifeGoal,
  goals
}: {
  lifeGoal: LifeGoal
  goals: Goal[]
}) {
  console.log(lifeGoal)
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
