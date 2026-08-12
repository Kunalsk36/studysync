import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listboxRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (optionValue) => {
      onChange(optionValue);
      handleClose();
    },
    [onChange, handleClose]
  );

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen) {
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            handleSelect(options[focusedIndex].value);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
        break;
      case "Escape":
        e.preventDefault();
        handleClose();
        break;
      case "Tab":
        if (isOpen) handleClose();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  useEffect(() => {
    if (isOpen && listboxRef.current && focusedIndex >= 0) {
      const optionEl = listboxRef.current.children[focusedIndex];
      if (optionEl) {
        optionEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, focusedIndex]);

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--fg)] shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={cn("truncate", !selectedOption && "text-[var(--fg-muted)]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[var(--border)] bg-[var(--surface)] py-1 text-sm shadow-md focus:outline-none"
          role="listbox"
          tabIndex={-1}
        >
          {options.length === 0 ? (
            <li className="relative flex cursor-default select-none items-center py-2 px-3 text-[var(--fg-muted)]">
              No options available
            </li>
          ) : (
            options.map((option, index) => {
              const isSelected = String(option.value) === String(value);
              const isFocused = index === focusedIndex;

              return (
                <li
                  key={option.value}
                  className={cn(
                    "relative flex cursor-default select-none items-center py-2 pl-3 pr-9",
                    isFocused ? "bg-primary/10 text-primary" : "text-[var(--fg)]",
                    !isFocused && "hover:bg-[var(--border)] hover:text-[var(--fg)]"
                  )}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <span className={cn("block truncate", isSelected ? "font-semibold" : "font-normal")}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span
                      className={cn(
                        "absolute inset-y-0 right-0 flex items-center pr-3",
                        isFocused ? "text-primary" : "text-primary"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
