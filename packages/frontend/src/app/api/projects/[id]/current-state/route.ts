import { NextResponse } from 'next/server'
import { queries, mutations } from '@life-tracker/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const projectId = Number((await params).id)
  try {
    const state = await queries.project.getProjectCurrentState(projectId)
    return NextResponse.json(state)
  } catch (error) {
    console.error('Error fetching project current state:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project current state' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const projectId = Number((await params).id)
  const { stateId } = await request.json()

  try {
    await mutations.project.updateProjectState(projectId, stateId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating project state:', error)
    return NextResponse.json(
      { error: 'Failed to update project state' },
      { status: 500 }
    )
  }
}
