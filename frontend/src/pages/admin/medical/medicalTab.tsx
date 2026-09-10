import React from "react";
import {ChevronRight, Plus, Stethoscope} from "lucide-react";
import {medFilterOption, medFilters, medRecords, medData} from "./medicalData";
import {defaultColumns} from "/@/components/table/Table";
import {ROUTES} from "/@/config/RoutePaths.js";
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {HyperlinkText, LinkButton} from "/@/components/Button";

export default function MedicalTab() {
    return (
        <DefaultTablePreset<medData>
            title="Medical"
            icon={Stethoscope}
            filterableColumns={medFilters}
            filterOptions={medFilterOption}
            data={medRecords}
            columns={defaultColumns}
            panelAddon={
                <LinkButton
                    title={`New Medical Record`}
                    route={`${ROUTES.staff.medical.createNewRecord}`}
                    icon={Plus}
                />
            }
            renderAction={
                (medical) => (
                    <HyperlinkText
                        title={`View`}
                        link={`${ROUTES.staff.medical.viewRecord}`}
                        // link={`${ROUTES.staff.medical.viewRecord}/${medical.id}`}
                        icon={ChevronRight}
                    />
                )

            }
        />

    );
}