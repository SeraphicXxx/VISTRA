import React from "react";
import {ChevronRight, Plus, Syringe} from "lucide-react";
import {dentalRecords, DentalData, DentalColumns} from "./DentalData";
import { ROUTES } from "/@/config/RoutePaths.js";
import {DefaultTablePreset} from "/@/components/table/TableDesignPreset";
import {HyperlinkText, LinkButton} from "/@/components/Button";

export default function DentalTab() {
  return (

      <DefaultTablePreset<DentalData>
          title="Dental"
          icon={Syringe}
          data={dentalRecords}
          columns={DentalColumns}
          panelAddon={
              <LinkButton
                  title={`New Dental Record`}
                  route={`${ROUTES.staff.dental.createNewRecord}`}
                  icon={Plus}
              />
            }
          renderAction={
          (dental) => (
              <HyperlinkText
                  title={`View`}
                  link={`${ROUTES.staff.dental.viewRecord}`}
                  // link={`${ROUTES.staff.dental.viewRecord}/${dental.id}`}
                  icon={ChevronRight}
              />
          )
      }
          />
  );
}