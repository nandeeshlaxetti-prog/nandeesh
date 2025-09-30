import { useState, useCallback } from 'react'

export function useSharedLayout() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback((id: string) => {
    setSelectedId(id)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Small delay to allow animation to complete
    setTimeout(() => setSelectedId(null), 200)
  }, [])

  const reset = useCallback(() => {
    setSelectedId(null)
    setIsOpen(false)
  }, [])

  return {
    selectedId,
    isOpen,
    open,
    close,
    reset
  }
}

// Usage example:
/*
const { selectedId, isOpen, open, close } = useSharedLayout()

// In list item:
<motion.div layoutId={`item-${item.id}`} onClick={() => open(item.id)}>
  {item.title}
</motion.div>

// In modal/drawer:
{isOpen && selectedId && (
  <motion.h2 layoutId={`title-${selectedId}`}>
    {item.title}
  </motion.h2>
)}
*/
