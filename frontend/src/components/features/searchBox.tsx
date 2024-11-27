import React, { useState, useEffect } from "react";

// Custom Hook debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function để hủy bỏ setTimeout nếu value thay đổi trước khi hết thời gian
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Sử dụng custom hook debounce
  const debouncedQuery = useDebounce(query, 500); // Debounce với delay là 500ms

  // Gọi API mỗi khi giá trị debounced thay đổi
  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery); // Gọi hàm tìm kiếm với query debounced
    }
  }, [debouncedQuery, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Cập nhật query khi người dùng nhập
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search by name, author, or category..."
        className="w-full p-2 rounded-md border border-gray-300"
      />
    </div>
  );
};

export default SearchBox;
