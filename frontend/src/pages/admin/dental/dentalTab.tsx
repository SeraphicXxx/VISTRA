import React from "react";
import {ChevronRight, Plus, Syringe} from "lucide-react";
import {dentalFilters, dentalRecords, DentalData, dentalFiltersOptions} from "./DentalData";
import { ROUTES } from "/@/config/RoutePaths.js";
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {defaultColumns} from "/@/components/table/Table";
import {HyperlinkText, LinkButton} from "/@/components/Button";

export default function DentalTab() {
  return (

      <DefaultTablePreset<DentalData>
          title="Dental"
          icon={Syringe}
          filterableColumns={dentalFilters}
          filterOptions={dentalFiltersOptions}
          data={dentalRecords}
          columns={defaultColumns}
          action={
              <LinkButton
                  title={`New Dental Record`}
                  route={`${ROUTES.admin.dental.createNewRecord}`}
                  icon={Plus}
              />
            }
          renderAction={
          (dental) => (
              <HyperlinkText
                  title={`View`}
                  link={`${ROUTES.admin.dental.viewRecord}`}
                  // link={`${ROUTES.admin.dental.viewRecord}/${dental.id}`}
                  icon={ChevronRight}
              />
          )
      }
          />
  );
}