"use client";

import PageHeader from "@/src/components/PageHeader";
import PersonList from "@/src/components/PersonList";

export default function PersonListPage() {
  return (
    <div className="container">
      <PageHeader
        title="Person List"
        description="View and manage saved person profiles"
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="row">
        <div className="col-md-12">
          <PersonList />
        </div>
      </div>
    </div>
  );
}
