'use client';

import { Task } from '@/app/tasks/tasks.type';
import { hierarchy, tree } from 'd3-hierarchy';
import { Layers2Icon, Layers3Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  ControlButton,
  Controls,
  Edge,
  MiniMap,
  Node,
  Position,
  ReactFlowProvider,
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

const fitViewOptions = {
  padding: 0.2,
  maxZoom: 1,
  minZoom: 0.1
};

interface TreeNodeData {
  id: string;
  type: 'task' | 'goal' | 'root';
  children?: TreeNodeData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function processTreeData(
  rootGoal: LifeGoal,
  goals: Goal[],
  tasks: Task[]
): { metaTreeData: TreeNodeData; allGoalIds: Set<number> } {
  const allGoalIds = new Set<number>();
  // 递归处理目标树
  const processTreeNode = (goal: Goal): TreeNodeData => {
    // 获取当前目标的任务
    const subTasks = tasks.filter((task) => task.goalId === goal.id);
    allGoalIds.add(goal.id);
    return {
      data: {
        ...goal,
        hasSubTasks: subTasks.length > 0
      },
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

  return {
    metaTreeData: {
      data: { ...rootGoal, hasChildren: goals.length > 0 },
      id: 'root',
      type: 'root' as const,
      children: goals.map(processTreeNode)
    },
    allGoalIds
  };
}

const layoutedTreeData = (
  treeData: TreeNodeData,
  setExpandedNodes: (nodes: Set<number>) => void
) => {
  //filter out children info of treeData when is Collapsed
  const filterCollapsedChildren = (node: TreeNodeData) => {
    node.children?.forEach(filterCollapsedChildren);
    if (node.data.collapsed) {
      node.children = [];
    }
  };

  filterCollapsedChildren(treeData);

  // 1. 使用 d3-hierarchy 计算布局
  const root = hierarchy(treeData);
  const treeLayout = tree<TreeNodeData>()
    .nodeSize([nodeHeight * 1.2, nodeWidth * 1.5])
    .separation((a, b) => (a.parent === b.parent ? 1.3 : 1.3));

  const layoutedTree = treeLayout(root);

  // 2. 将层次结构转换为 react-flow 的格式
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 处理所有节点
  layoutedTree.descendants().forEach((node) => {
    const id = node.data.id;

    if (node.data.type === 'goal') {
      node.data.data.setExpandedNodes = setExpandedNodes;
    }

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
};

function GoalsTreeContent({
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
  //by default, all nodes are collapsed
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  const { metaTreeData, allGoalIds } = useMemo(() => {
    return processTreeData(lifeGoal, goals, tasks);
  }, [lifeGoal, goals, tasks]);

  useEffect(() => {
    const dfsAddCollapsedInfo = (node: TreeNodeData) => {
      if (!node.children) return;
      node.children.forEach((child) => {
        if (child.children?.length) {
          child.data.collapsed = !expandedNodes.has(child.data.id);
          dfsAddCollapsedInfo(child);
        }
      });
    };

    const treeDataWithCollapsed = JSON.parse(JSON.stringify(metaTreeData));
    dfsAddCollapsedInfo(treeDataWithCollapsed);

    const { nodes: layoutedNodes, edges: layoutedEdges } = layoutedTreeData(
      treeDataWithCollapsed,
      setExpandedNodes
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedNodes, metaTreeData]);

  return (
    <div className="w-full h-screen p-4">
      <div className="w-full h-full bg-white rounded-lg shadow-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={fitViewOptions}
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
          <Controls
            showInteractive={false}
            position={'top-left'}
            fitViewOptions={fitViewOptions}
          >
            <ControlButton
              onClick={() => {
                //FIXME 这里需要优化，展开后最好自动fit to screen
                setExpandedNodes(allGoalIds);
              }}
            >
              <Layers2Icon className=" text-black" />
            </ControlButton>
            <ControlButton
              onClick={() => {
                setExpandedNodes(new Set());
              }}
              title="折叠所有目标"
            >
              <Layers3Icon className=" text-black" />
            </ControlButton>
          </Controls>
          <MiniMap className="hidden md:block" position={'bottom-left'} />
        </ReactFlow>
      </div>
    </div>
  );
}

export const GoalsTree = withReactFlow(GoalsTreeContent);

function withReactFlow<T extends object>(Component: React.ComponentType<T>) {
  const WrappedComponent = (props: T) => {
    return (
      <ReactFlowProvider>
        <Component {...props} />
      </ReactFlowProvider>
    );
  };
  WrappedComponent.displayName = `withReactFlow(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
}
