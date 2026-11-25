import {useMemo, type ComponentType, type ReactNode} from "react";
import {ChevronRight, Plus} from "lucide-react";
import {DefaultTablePreset} from "/@/components/table/TableDesignPreset";
import {HyperlinkText, LinkButton} from "/@/components/Button";
import {removeNullFilters} from "/@/components/Filters";
import type {Column} from "/@/components/table/Table";

export interface VisitTabCreateAction {
    title: string;
    route: string;
}

interface VisitTabProps<Row extends { id: string }, Item, F extends object> {
    title: string;
    icon: ComponentType<{ className?: string }>;
    columns: Column<Row>[];
    items: Item[];
    toRow: (item: Item) => Row;
    isLoading: boolean;
    totalPages?: number;
    page?: number;
    createAction?: VisitTabCreateAction;
    headerActions?: ReactNode;
    buildViewLink?: (row: Row) => string;
    renderAction?: (row: Row) => ReactNode;
    showFilters?: boolean;
    showPagination?: boolean;
    setFilters?: (filters: F) => void;
}

export function VisitTab<Row extends { id: string }, Item, F extends object = object>({
    title,
    icon,
    columns,
    items,
    toRow,
    isLoading,
    totalPages,
    page,
    createAction,
    headerActions,
    buildViewLink,
    renderAction,
    showFilters = true,
    showPagination = true,
    setFilters,
}: VisitTabProps<Row, Item, F>) {
    const rows = useMemo(
        () => items.map(toRow),
        [items, toRow]
    );

    const hasPanelActions = Boolean(createAction) || Boolean(headerActions);

    return (
        <DefaultTablePreset<Row>
            title={title}
            icon={icon}
            isLoading={isLoading}
            data={rows}
            columns={columns}
            totalPages={totalPages}
            page={page}
            panelAddon={
                hasPanelActions ? (
                    <div className="flex items-center gap-2">
                        {headerActions}
                        {createAction && (
                            <LinkButton
                                title={createAction.title}
                                route={createAction.route}
                                icon={Plus}
                            />
                        )}
                    </div>
                ) : undefined
            }
            renderAction={
                renderAction
                    ? renderAction
                    : buildViewLink
                        ? (row) => (
                            <HyperlinkText
                                title="View"
                                link={buildViewLink(row)}
                                icon={ChevronRight}
                            />
                        )
                        : undefined
            }
            showFilters={showFilters}
            showPagination={showPagination}
            onRun={
                setFilters
                    ? (search, filters, page, pageSize) =>
                        setFilters({
                            search,
                            ...removeNullFilters(filters),
                            page,
                            page_size: pageSize,
                        } as F)
                    : undefined
            }
        />
    );
}