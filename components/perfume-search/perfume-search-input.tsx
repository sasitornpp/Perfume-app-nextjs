import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/Store";
import { Loader2, SearchIcon } from "lucide-react";
import { fetchPerfumesByFilters, fetchPerfumeSuggestions } from "@/redux/filters/filterPerfumesReducer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

let debounceTimer: NodeJS.Timeout;

export default function PerfumeSearchInput({ formFilters, handleChange, handleSearch, searchFocused, setSearchFocused, loading }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const suggestions = useSelector((state: RootState) => state.filters.suggestions);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    console.log(suggestions);

    // Handle keyboard navigation in suggestions
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestions || suggestions.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelectSuggestion(suggestions[selectedIndex].name);
                } else {
                    handleSearch();
                }
                break;
            case "Escape":
                setShowSuggestions(false);
                break;
        }
    };

    // Handle input change with debounce for suggestions
    const handleInputChange = (value: string) => {
        handleChange("search_query", value);
        if (value.length > 0) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                dispatch(fetchPerfumeSuggestions(value));
                setShowSuggestions(true);
            }, 250);
        } else {
            setShowSuggestions(false);
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (name: string) => {
        handleChange("search_query", name);
        setShowSuggestions(false);
        dispatch(fetchPerfumesByFilters());
        setSelectedIndex(-1);
    };

    return (
        <div className="relative flex flex-col w-full">
            <div className="flex">
                <Input
                    className={`pl-10 pr-4 py-6 rounded-l-full border-2 transition-all ${searchFocused
                        ? "border-primary shadow-lg"
                        : "border-border shadow-sm"
                        }`}
                    placeholder="Search perfumes by name..."
                    value={formFilters?.search_query ?? ""}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                    disabled={loading}
                />
                <Button
                    onClick={handleSearch}
                    className="rounded-r-full px-6 shadow-md h-13"
                    variant="default"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" size={25} /> : <SearchIcon size={25} />}
                </Button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            className={`px-4 py-2 cursor-pointer ${index === selectedIndex ? "bg-gray-200" : "hover:bg-gray-100"
                                }`}
                            onMouseDown={() => handleSelectSuggestion(item.name)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
