"use client";

import React, { useState, useMemo } from "react";
import { ContentStatusType } from "@/lib/admin/types";
import { StatusBadge } from "./status-badge";
import { useAdminRole } from "./role-context";
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Send,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Globe,
  Archive,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: "default" | "destructive" | "primary" | "secondary";
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  searchField?: keyof T | ((item: T, query: string) => boolean);
  onAddNew?: () => void;
  addNewLabel?: string;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSubmitForApproval?: (item: T) => void;
  onApprove?: (item: T) => void;
  onReject?: (item: T) => void;
  onPublish?: (item: T) => void;
  extraActions?: DataTableAction<T>[];
  emptyMessage?: string;
  categories?: { label: string; value: string }[];
  categoryField?: keyof T;
}

export function DataTable<T extends { id: string; status?: ContentStatusType | string; [key: string]: any }>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = "Search records...",
  searchField,
  onAddNew,
  addNewLabel = "Add New",
  onEdit,
  onView,
  onDelete,
  onSubmitForApproval,
  onApprove,
  onReject,
  onPublish,
  extraActions,
  emptyMessage = "No records found.",
  categories,
  categoryField,
}: DataTableProps<T>) {
  const { canApprove, canPublish } = useAdminRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((item) => (item.status || "").toUpperCase() === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "ALL" && categoryField) {
      result = result.filter((item) => String(item[categoryField]) === categoryFilter);
    }

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => {
        if (typeof searchField === "function") {
          return searchField(item, q);
        }
        if (searchField && item[searchField]) {
          return String(item[searchField]).toLowerCase().includes(q);
        }
        // Default search across all string fields
        return Object.values(item).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        const comparison = String(valA).localeCompare(String(valB));
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, statusFilter, categoryFilter, categoryField, searchQuery, searchField, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar if title provided */}
      {(title || onAddNew) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {title && <h2 className="text-h3 font-bold text-text tracking-tight">{title}</h2>}
            {description && <p className="text-small text-text-muted mt-1">{description}</p>}
          </div>
          {onAddNew && (
            <Button onClick={onAddNew} variant="primary" size="default" className="shrink-0">
              <Plus className="h-4 w-4" />
              {addNewLabel}
            </Button>
          )}
        </div>
      )}

      {/* Filter and search toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface p-3 sm:p-3.5 rounded-lg border border-border">
        {/* Search */}
        <div className="relative flex-1 w-full min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-9 min-h-[44px] sm:min-h-[36px] sm:h-9 text-base sm:text-xs bg-background w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="w-full sm:w-[150px]">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="min-h-[44px] sm:min-h-[36px] sm:h-9 text-base sm:text-xs bg-background w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter (Optional) */}
          {categories && categories.length > 0 && (
            <div className="w-full sm:w-[160px]">
              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="min-h-[44px] sm:min-h-[36px] sm:h-9 text-base sm:text-xs bg-background w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Reset Filters */}
          {(searchQuery !== "" || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
                setCurrentPage(1);
              }}
              className="h-9 text-xs text-text-muted hover:text-text"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Batch actions bar if rows selected */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-primary-light/60 border border-primary/20 px-4 py-2.5 rounded-md text-xs">
          <span className="font-semibold text-primary-dark">
            {selectedIds.size} {selectedIds.size === 1 ? "item" : "items"} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-surface"
              onClick={() => alert(`Batch submitted ${selectedIds.size} items for approval`)}
            >
              <Send className="h-3 w-3 text-primary" />
              Submit Selected
            </Button>
            {canApprove && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-surface text-emerald-700 hover:bg-emerald-50"
                onClick={() => alert(`Approved ${selectedIds.size} items`)}
              >
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                Approve Selected
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="]text-xs text-emergency hover:bg-emergency-light"
              onClick={() => alert(`Deleted ${selectedIds.size} items`)}
            >
              <Trash2 className="h-3 w-3" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Header */}
            <thead className="bg-background border-b border-border text-text-light font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="text-text-muted hover:text-text focus:outline-none"
                    aria-label="Select all rows"
                  >
                    {selectedIds.size > 0 && selectedIds.size === paginatedData.length ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>

                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-4 py-3 ${col.sortable ? "cursor-pointer select-none hover:text-text" : ""} ${
                      col.className || ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && sortColumn === col.key && (
                        <span className="text-primary font-bold">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                <th className="w-16 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-light border border-border">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-text text-sm">{emptyMessage}</p>
                      <p className="text-xs text-text-light max-w-sm">
                        No matches were found for your current query or filters. Try adjusting your search term.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const isDraft = item.status === "DRAFT";
                  const isPending = item.status === "PENDING_APPROVAL";
                  const isApproved = item.status === "APPROVED";
                  const isPublished = item.status === "PUBLISHED";
                  const isRejected = item.status === "REJECTED";

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-background/80 transition-colors ${
                        isSelected ? "bg-primary-light/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="w-10 px-4 py-3 text-center">
                        <button
                          onClick={() => toggleSelectRow(item.id)}
                          className="text-text-muted hover:text-text focus:outline-none"
                          aria-label={`Select row ${item.id}`}
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Columns */}
                      {columns.map((col) => (
                        <td key={col.key} className={`px-4 py-3 text-text ${col.className || ""}`}>
                          {col.render ? (
                            col.render(item)
                          ) : col.key === "status" ? (
                            <StatusBadge status={item.status || "DRAFT"} size="sm" />
                          ) : (
                            <span>{String(item[col.key] ?? "—")}</span>
                          )}
                        </td>
                      ))}

                      {/* Row Actions Dropdown */}
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 text-text-muted hover:text-text"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1 text-xs">
                            <DropdownMenuLabel className="text-[10px] text-text-light uppercase tracking-wider">
                              Actions
                            </DropdownMenuLabel>

                            {onEdit && (
                              <DropdownMenuItem
                                onClick={() => onEdit(item)}
                                className="cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5 mr-2 text-primary" />
                                Edit Record
                              </DropdownMenuItem>
                            )}

                            {onView && (
                              <DropdownMenuItem
                                onClick={() => onView(item)}
                                className="cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 mr-2 text-text-muted" />
                                View Preview
                              </DropdownMenuItem>
                            )}

                            {/* Workflow Actions */}
                            {(isDraft || isRejected) && onSubmitForApproval && (
                              <DropdownMenuItem
                                onClick={() => onSubmitForApproval(item)}
                                className="cursor-pointer font-medium text-primary-dark"
                              >
                                <Send className="h-3.5 w-3.5 mr-2 text-primary" />
                                Submit for Approval
                              </DropdownMenuItem>
                            )}

                            {/* Approval actions (Hospital Director) */}
                            {canApprove && isPending && onApprove && (
                              <DropdownMenuItem
                                onClick={() => onApprove(item)}
                                className="cursor-pointer text-emerald-700 font-medium"
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                                Approve Content
                              </DropdownMenuItem>
                            )}

                            {canApprove && isPending && onReject && (
                              <DropdownMenuItem
                                onClick={() => onReject(item)}
                                className="cursor-pointer text-emergency"
                              >
                                <XCircle className="h-3.5 w-3.5 mr-2" />
                                Reject Submission
                              </DropdownMenuItem>
                            )}

                            {canPublish && (isApproved || isDraft) && onPublish && (
                              <DropdownMenuItem
                                onClick={() => onPublish(item)}
                                className="cursor-pointer text-secondary-dark font-medium"
                              >
                                <Globe className="h-3.5 w-3.5 mr-2" />
                                Publish to Website
                              </DropdownMenuItem>
                            )}

                            {/* Extra custom actions */}
                            {extraActions &&
                              extraActions
                                .filter((action) => (action.show ? action.show(item) : true))
                                .map((action, aIdx) => {
                                  const ActionIcon = action.icon;
                                  return (
                                    <DropdownMenuItem
                                      key={aIdx}
                                      onClick={() => action.onClick(item)}
                                      className={`cursor-pointer ${
                                        action.variant === "destructive" ? "text-emergency" : ""
                                      }`}
                                    >
                                      {ActionIcon && <ActionIcon className="h-3.5 w-3.5 mr-2" />}
                                      {action.label}
                                    </DropdownMenuItem>
                                  );
                                })}

                            {onDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onDelete(item)}
                                  className="cursor-pointer text-emergency focus:bg-emergency-light focus:text-emergency-dark"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  Delete / Archive
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-surface border-t border-border text-xs text-text-muted">
          <div>
            Showing <strong className="text-text">{filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
            <strong className="text-text">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </strong>{" "}
            of <strong className="text-text">{filteredData.length}</strong> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 text-xs bg-surface"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="text-xs font-semibold text-text px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 text-xs bg-surface"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
