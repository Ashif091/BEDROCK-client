import WorkspaceTitle from '@/components/ui/workspace/workspace-title'
import React from 'react'

const WorkSpaceSettings = () => {
  return (
    <div className="w-full h-full select-none">
      <p className="text-sm font-extralight opacity-65">Settings</p>
      <div className="flex items-center my-3 border-t-[.1rem] border-[#383838]">
        <WorkspaceTitle/>
      </div>

    </div>
  )
}

export default WorkSpaceSettings
