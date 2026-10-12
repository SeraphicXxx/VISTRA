import {useMemo, type ComponentType} from "react";
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
    buildViewLink: (row: Row) => string;
    setFilters: (filters: F) => void;
}

export function VisitTab<Row extends { id: string }, Item, F extends object>({
    title,
    icon,
    columns,
    items,
    toRow,
    isLoading,
    totalPages,
    page,
    createAction,
    buildViewLink,
    setFilters,
}: VisitTabProps<Row, Item, F>) {
    const rows = useMemo(
        () => items.map(toRow),
        [items, toRow]
    );

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
                createAction ? (
                    <LinkButton
                        title={createAction.title}
                        route={createAction.route}
                        icon={Plus}
                    />
                ) : undefined
            }
            renderAction={
                (row) => (
                    <HyperlinkText
                        title="View"
                        link={buildViewLink(row)}
                        icon={ChevronRight}
                    />
                )
            }
            onRun={(search, filters, page, pageSize) =>
                setFilters({
                    search,
                    ...removeNullFilters(filters),
                    page,
                    page_size: pageSize,
                } as F)
            }
        />
    );
}
