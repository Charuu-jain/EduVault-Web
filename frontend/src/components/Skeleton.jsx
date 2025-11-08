function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10 animate-pulse"></div>
      </td>
    </tr>
  );
}

function ListItemSkeleton() {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mt-2 animate-pulse"></div>
    </div>
  );
}

export { CardSkeleton, TableRowSkeleton, ListItemSkeleton };
