type FallBackProps = {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallBackProps) => {
  return (
    <div className="p-4 border-2 border-red-500 bg-neutral-900 rounded-lg">
      <h2 className="text-lg font-semibold text-red-700">
        Something went wrong
      </h2>
      <pre className="my-2 text-sm text-red-600">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}
export default ErrorFallback
