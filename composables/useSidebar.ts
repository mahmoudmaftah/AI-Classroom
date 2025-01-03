export const useSidebar = () => {
  const isOpen = useState('sidebar-open', () => true)

  const toggleSidebar = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    toggleSidebar
  }
}