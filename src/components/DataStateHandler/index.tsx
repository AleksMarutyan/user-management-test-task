import React, { ReactNode } from "react";

interface DataStateHandlerProps<T> {
  isError: boolean;
  isLoading: boolean;
  children: ReactNode;
  ErrorComponent?: React.FC;
  NoDataComponent?: React.FC;
  data: T | null | undefined;
  LoadingComponent?: React.FC;
}

const DefaultLoadingComponent: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

const DefaultNoDataComponent: React.FC = () => (
  <div className="flex flex-col justify-center items-center p-8 text-gray-500">
    <svg
      className="w-12 h-12 mb-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p>No data available</p>
  </div>
);

export function DataStateHandler<T>({
  data,
  isError,
  children,
  isLoading,
  ErrorComponent = () => <div>Error loading data</div>,
  NoDataComponent = DefaultNoDataComponent,
  LoadingComponent = DefaultLoadingComponent,
}: DataStateHandlerProps<T>) {
  if (isError) {
    return <ErrorComponent />;
  }
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <NoDataComponent />;
  }

  return children;
}
