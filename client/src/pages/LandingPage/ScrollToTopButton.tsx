import { useState } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Thực hiện cuộc kiểm tra khi cuộn trang
  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    // Hiển thị hoặc ẩn nút dựa trên vị trí cuộn
    setIsVisible(scrollPosition > 250); // Thay 300 bằng giá trị bạn mong muốn
  };

  // Cuộn lên đầu trang khi nút được nhấp
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Hiệu ứng cuộn mượt mà
    });
  };

  // Đăng ký sự kiện cuộn
  window.addEventListener('scroll', handleScroll);

  return (
    <button
      className={`fixed bottom-16 right-16 bg-emerald-500 text-white px-4 py-3 rounded-full transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
