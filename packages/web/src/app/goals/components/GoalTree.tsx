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
import { GoalNode } from './GoalNode'
import { LifeGoalNode } from './LifeGoalNode'
import { Task } from '@/app/tasks/tasks.type'
import { TaskNode } from './TaskNode'

const nodeWidth = 300
const nodeHeight = 100

const nodeTypes = {
  root: LifeGoalNode,
  goal: GoalNode,
  task: TaskNode
}

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  // 设置图的方向和节点间距
  dagreGraph.setGraph({
    rankdir: 'LR',
    nodesep: 50,
    ranksep: 80
  })

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
  goals: Goal[],
  tasks: Task[]
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

  const processNode = (goal: Goal, parentId: string, tasks: Task[]) => {
    const goalNodeId = `goal_${goal.id}`
    const subTasks = tasks.filter((task) => task.goalId === goal.id)

    nodes.push({
      id: goalNodeId,
      data: { ...goal, hasSubTasks: subTasks.length > 0 },
      position: { x: 0, y: 0 },
      type: 'goal',
      targetPosition: Position.Left,
      sourcePosition: Position.Right
    })

    // 创建与父节点的连接
    edges.push({
      id: `e${parentId}-${goalNodeId}`,
      source: parentId,
      target: goalNodeId
    })

    // 先创建所有任务节点
    subTasks.forEach((task) => {
      const taskNodeId = `task_${task.id}`
      nodes.push({
        id: taskNodeId,
        data: task,
        position: { x: 0, y: 0 },
        type: 'task',
        targetPosition: Position.Left,
        sourcePosition: Position.Right
      })

      // 立即为每个任务创建与目标的连接
      edges.push({
        id: `e${goalNodeId}-${taskNodeId}`,
        source: goalNodeId,
        target: taskNodeId
      })
    })

    // 处理子节点
    if (goal.children) {
      goal.children.forEach((child) => processNode(child, goalNodeId, tasks))
    }
  }

  // 处理所有顶层目标，将它们连接到根节点
  goals.forEach((goal) => processNode(goal, 'root', tasks))

  return getLayoutedElements(nodes, edges)
}

export function GoalsTree({
  lifeGoal,
  goals,
  tasks
}: {
  lifeGoal: LifeGoal
  goals: Goal[]
  tasks: Task[]
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = processGoals(
      lifeGoal,
      goals,
      tasks
    )
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [lifeGoal, goals, tasks, setNodes, setEdges])

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
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
