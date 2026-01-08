// src/components/SidebarToggle.js
import { useEffect } from "react";

function SidebarToggle() {
  useEffect(() => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');

    if (!sidebarToggle) return;

    // Load trạng thái toggle từ localStorage (nếu muốn)
    const saved = localStorage.getItem('sb|sidebar-toggle');
    if (saved === 'true') {
      document.body.classList.add('sb-sidenav-toggled');
    }

    // Xử lý click
    const handleClick = (event) => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem(
        'sb|sidebar-toggle',
        document.body.classList.contains('sb-sidenav-toggled')
      );
    };

    sidebarToggle.addEventListener('click', handleClick);

    // cleanup
    return () => {
      sidebarToggle.removeEventListener('click', handleClick);
    };
  }, []);

  return null; // Không render gì cả
}

export default SidebarToggle;
