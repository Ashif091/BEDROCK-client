
const LoadingEffect = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#191919] bg-opacity-75">
      <div className="flex space-x-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{animationDelay: `${index * 0.1}s`}}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default LoadingEffect
