import React from "react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Skeleton height={40} width="30%" className="rounded" />
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              height={20}
              width="100%"
              className="rounded"
            />
          ))}
        </div>
      </SkeletonTheme>
    </div>
  )
}

export default LoadingSkeleton
