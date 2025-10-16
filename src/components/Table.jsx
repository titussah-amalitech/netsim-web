import { Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "./common"

export const DataTable = ({
  data = [],
  columns = [],
  onRowClick,
  onEdit,
  onDelete,
  onView,
  loading = false,
}) => {
  const renderCell = (item, column, index) => {
    if (column.render) return column.render(item, index)
    return item[column.accessor]
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || item._id || index}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`${onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" : ""
                    } transition-colors`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {renderCell(item, column, index)}
                    </td>
                  ))}

                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              onView(item)
                            }}
                          />
                        )}
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Edit className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEdit(item)
                            }}
                          />
                        )}
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(item.id || item._id)
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
};