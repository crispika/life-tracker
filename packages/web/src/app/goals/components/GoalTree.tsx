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
import { LifeGoalNode } from './LifeGoalNode'
import { GoalNode } from './GoalNode'

const nodeWidth = 200
const nodeHeight = 40

const nodeTypes = {
  root: LifeGoalNode,
  goal: GoalNode
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

function processGoals(
  rootGoal: LifeGoal,
  goals: Goal[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // 添加根节点（用户的人生目标）
  nodes.push({
    id: 'root',
    data: rootGoal,
    position: { x: 0, y: 0 },
    type: 'root',
    targetPosition: Position.Left,
    sourcePosition: Position.Right
  })

  const processNode = (goal: Goal, parentId: string) => {
    nodes.push({
      id: goal.id.toString(),
      data: goal,
      position: { x: 0, y: 0 },
      type: 'goal',
      targetPosition: Position.Left,
      sourcePosition: Position.Right
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
  goals.forEach((goal) => processNode(goal, 'root'))

  return getLayoutedElements(nodes, edges)
}

export function GoalsTree({
  lifeGoal,
  goals
}: {
  lifeGoal: LifeGoal
  goals: Goal[]
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = processGoals(
      lifeGoal,
      goals
    )
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [lifeGoal, goals, setNodes, setEdges])

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
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
