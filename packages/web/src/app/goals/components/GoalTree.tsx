'use client';

import { Task } from '@/app/tasks/tasks.type';
import { hierarchy, tree } from 'd3-hierarchy';
import { useEffect } from 'react';
import ReactFlow, {
  Controls,
  Edge,
  MiniMap,
  Node,
  Position,
  useEdgesState,
  useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Goal, LifeGoal } from '../goals.type';
import { GoalNode } from './GoalNode';
import { LifeGoalNode } from './LifeGoalNode';
import { TaskNode } from './TaskNode';

const nodeWidth = 300;
const nodeHeight = 100;

const nodeTypes = {
  root: LifeGoalNode,
  goal: GoalNode,
  task: TaskNode
};

interface TreeNodeData {
  id: string;
  type: 'task' | 'goal' | 'root';
  children?: TreeNodeData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function processGoals(
  rootGoal: LifeGoal,
  goals: Goal[],
  tasks: Task[]
): { nodes: Node[]; edges: Edge[] } {
  // 递归处理目标树
  const processTreeNode = (goal: Goal): TreeNodeData => {
    // 获取当前目标的任务
    const subTasks = tasks.filter((task) => task.goalId === goal.id);

    return {
      data: { ...goal, hasSubTasks: subTasks.length > 0 },
      id: `goal_${goal.id}`,
      type: 'goal' as const,
      children: [
        // 递归处理子目标
        ...(goal.children?.map(processTreeNode) || []),
        // 添加当前目标的任务
        ...subTasks.map((task) => ({
          data: task,
          id: `task_${task.id}`,
          type: 'task' as const
        }))
      ]
    };
  };

  // 1. 构建完整的树形结构
  const treeData: TreeNodeData = {
    data: rootGoal,
    id: 'root',
    type: 'root' as const,
    children: goals.map(processTreeNode)
  };

  // 2. 使用 d3-hierarchy 计算布局
  const root = hierarchy(treeData);
  const treeLayout = tree<TreeNodeData>()
    .nodeSize([nodeHeight * 1.2, nodeWidth * 1.5])
    .separation((a, b) => (a.parent === b.parent ? 1.1 : 1.5));

  const layoutedTree = treeLayout(root);

  // 3. 将层次结构转换为 react-flow 的格式
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 处理所有节点
  layoutedTree.descendants().forEach((node) => {
    const id = node.data.id;

    nodes.push({
      id,
      data: node.data.data,
      position: {
        x: node.y,
        y: node.x
      },
      type: node.data.type,
      targetPosition: Position.Left,
      sourcePosition: Position.Right
    });

    // 添加边
    if (node.parent) {
      edges.push({
        id: `e${node.parent.data.id}-${id}`,
        source: node.parent.data.id,
        target: id
      });
    }
  });

  return { nodes, edges };
}

export function GoalsTree({
  lifeGoal,
  goals,
  tasks
}: {
  lifeGoal: LifeGoal;
  goals: Goal[];
  tasks: Task[];
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = processGoals(
      lifeGoal,
      goals,
      tasks
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifeGoal, goals, tasks]);

  return (
    <div className="w-full h-screen p-4">
      <div className="w-full h-full bg-white rounded-lg shadow-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{
            padding: 0.2,
            maxZoom: 1,
            minZoom: 0.4
          }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: {
              stroke: '#b1b1b7',
              strokeWidth: 1.5,
              opacity: 0.8
            }
          }}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          zoomOnDoubleClick={false}
        >
          <Controls showInteractive={false} position={'bottom-left'} />
          <MiniMap className="hidden md:block" />
        </ReactFlow>
      </div>
    </div>
  );
}
