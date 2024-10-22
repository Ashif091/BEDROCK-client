'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'

interface NotificationData {
  workspaceName: string
  workspaceIcon: string
  userAddedBy: {
    _id: string
    fullname: string
    email: string
    profile?: string
  }
  role: string
}

interface WorkspaceNotificationProps {
  data: NotificationData
  onClose: () => void
}

export function WorkspaceNotification({ data, onClose }: WorkspaceNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-4 text-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">New Workspace Invitation</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center mb-2">
          {data.workspaceIcon && (
            <Image
              src={data.workspaceIcon}
              alt={data.workspaceName}
              width={40}
              height={40}
              className=" mr-2"
            />
          )}
          <span className="font-medium">{data.workspaceName}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          You've been added to this workspace as a <span className="font-semibold">{data.role}</span>.
        </p>
        <div className="flex items-center">
          {data.userAddedBy.profile && (
            <div className='rounded-full w-7 h-7 border-blue-300 ring-2 object-cover mr-2 overflow-hidden'>

                <Image
                  src={data.userAddedBy.profile}
                  alt={data.userAddedBy.fullname}
                  width={24}
                  height={24}
                />
            </div>
          )}
          <span className="text-sm text-gray-600">
            Added by {data.userAddedBy.fullname}
          </span>
        </div>
      </div>
    </motion.div>
  )
}