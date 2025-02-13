const ErrorPage = ({ error }) => {
  // Log the full error for debugging
  console.error('Full authentication error:', error);

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{error?.message || 'An unexpected error occurred'}</p>
    </div>
  )
}

export default ErrorPage;