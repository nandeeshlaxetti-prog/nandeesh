'use client'

export function ManualFetchModal() {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-gray-900">Manual Fetch Required</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Manual fetch functionality will be implemented here.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}