import React from "react";
import {GenericTable} from "../../../components/Table.jsx";
import {getTableColumns} from "../../../utils/TableUtils.js";

export default function MedicalTable({ medicalRecords }) {
  return (
    <div className="overflow-x-auto">
      <GenericTable
          data={medicalRecords}
          columns={getTableColumns(medicalRecords, ["id"])}
      />
    </div>
  );
}