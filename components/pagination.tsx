import { ChevronLeft,  ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    baseUrl: string;
    totalPages: number;
    searchParams: Record<string, string | undefined>;
}
export default function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {

    const getPageUrl = (page: number) => {
        const params = new URLSearchParams({...searchParams, page: String(page)});
        return `${baseUrl}?${params.toString()}`;
    }

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }
        if (currentPage - delta > 2) {
            rangeWithDots.push(1,"...");
        }else{
            rangeWithDots.push(1);
        }
        rangeWithDots.push(...range);
        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        }else{
            rangeWithDots.push(totalPages);
        }
        return rangeWithDots;
    }
    const visiblePages = getVisiblePages();
    if(totalPages <=1) return null;
    return (
        <div className="flex justify-center gap-1 items-center">
            
                <nav className="flex items-center justify-center gap-1">
                <Link   href={getPageUrl(currentPage - 1)} className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg
                     ${currentPage <= 1 ? "text-gray-200 cursor-not-allowed" :
                      "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"}`} aria-disabled={currentPage <= 1}>
                   <ChevronLeft /> Prev
                </Link>
                        {visiblePages.map((page, index) => {
                            if(page === "...") {
                                return (<span key={index} className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-500 cursor-default">...</span>)
                            }
                            const pageNumber= page as number;
                            const isCurrentPage = pageNumber === currentPage;
                            return (
                                <Link key={index} href={getPageUrl(pageNumber)} className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg
                                    ${isCurrentPage ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"}`}>
                                    {pageNumber}
                                </Link>
                            );
                        })}
                <Link   href={getPageUrl(currentPage + 1)} className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg
                     ${currentPage >= totalPages ? "text-gray-200 cursor-not-allowed" :
                      "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"}`} aria-disabled={currentPage >= totalPages}>
                   Next <ChevronRight />
                </Link>
                </nav>
        </div>
    );
}
