import React from 'react'

export interface SignalFilterProps {
  activeFilters: Set<string>
  onToggle: (group: string) => void
  allGroups: string[]
}

export const SignalFilter: React.FC<SignalFilterProps> = ({
  activeFilters,
  onToggle,
  allGroups,
}) => {
  return (
    <div
      data-testid="signal-filter"
      className="flex flex-wrap gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700"
    >
      {allGroups.map((group) => (
        <label
          key={group}
          className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer select-none"
        >
          <input
            type="checkbox"
            checked={activeFilters.has(group)}
            onChange={() => onToggle(group)}
            className="w-3.5 h-3.5 rounded border-gray-500 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-gray-700"
          />
          {group}
        </label>
      ))}
    </div>
  )
}

export default SignalFilter
