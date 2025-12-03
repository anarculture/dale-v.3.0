"use client";

import React from "react";
import {
  DButton,
  DInput,
  DSelect,
  DTextarea,
  DCard,
  DBadge,
  DIconButton,
  DFormField,
  DAlert,
  DSpinner,
  DEmptyState,
} from "@/components/ui";
import { DPageSection } from "@/components/layout/DPageSection";
import { Search, PlusCircle, AlertTriangle } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8">Dale Design System</h1>

      <DPageSection title="Buttons" description="Various button styles and states.">
        <div className="flex flex-wrap gap-4 items-center">
          <DButton>Primary</DButton>
          <DButton variant="bordered">Bordered</DButton>
          <DButton variant="light">Light</DButton>
          <DButton variant="flat">Flat</DButton>
          <DButton variant="ghost">Ghost</DButton>
          <DButton color="secondary">Secondary</DButton>
          <DButton color="success">Success</DButton>
          <DButton color="warning">Warning</DButton>
          <DButton color="danger">Danger</DButton>
          <DButton isLoading>Loading</DButton>
          <DButton leftIcon={<PlusCircle size={18} />}>With Icon</DButton>
          <DIconButton icon={<Search size={20} />} label="Search" />
        </div>
      </DPageSection>

      <DPageSection title="Form Inputs" description="Input fields, selects, and textareas.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <DInput label="Email" placeholder="Enter your email" />
          <DInput label="Password" type="password" placeholder="Enter your password" />
          <DInput label="Error State" error="Invalid email address" defaultValue="invalid@" />
          
          <DSelect
            label="City"
            placeholder="Select a city"
            options={[
              { label: "Caracas", value: "caracas" },
              { label: "Valencia", value: "valencia" },
              { label: "Maracaibo", value: "maracaibo" },
            ]}
          />

          <DTextarea label="Notes" placeholder="Add any additional notes..." />
          
          <DFormField id="custom-field" label="Custom Field" helpText="This is a custom form field wrapper">
            <div className="p-2 border rounded bg-gray-50">Custom Content</div>
          </DFormField>
        </div>
      </DPageSection>

      <DPageSection title="Cards" description="Card components for content containers.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DCard header="Basic Card">
            <p>This is a basic card with header and body content.</p>
          </DCard>
          
          <DCard header="Card with Footer" footer={<DButton size="sm">Action</DButton>}>
            <p>This card has a footer action.</p>
          </DCard>
          
          <DCard noPadding>
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              No Padding Area
            </div>
            <div className="p-4">
              <p>Content with padding below.</p>
            </div>
          </DCard>
        </div>
      </DPageSection>

      <DPageSection title="Badges" description="Status indicators and tags.">
        <div className="flex gap-4">
          <DBadge>Default</DBadge>
          <DBadge color="primary">Primary</DBadge>
          <DBadge color="secondary">Secondary</DBadge>
          <DBadge color="success">Success</DBadge>
          <DBadge color="warning">Warning</DBadge>
          <DBadge color="danger">Danger</DBadge>
          <DBadge variant="dot" color="success">Active</DBadge>
        </div>
      </DPageSection>

      <DPageSection title="Feedback" description="Alerts, spinners, and empty states.">
        <div className="space-y-6 max-w-2xl">
          <DAlert title="Info" description="This is an informational alert." />
          <DAlert variant="success" title="Success" description="Operation completed successfully." />
          <DAlert variant="warning" title="Warning" description="Please check your input." />
          <DAlert variant="error" title="Error" description="Something went wrong." />
          
          <div className="flex items-center gap-4">
            <DSpinner />
            <DSpinner size="lg" />
            <DSpinner color="warning" />
          </div>

          <DEmptyState
            icon={<AlertTriangle size={48} />}
            title="No Data Found"
            description="We couldn't find any results matching your criteria."
            actionLabel="Clear Filters"
            onAction={() => alert("Action clicked")}
          />
        </div>
      </DPageSection>
    </div>
  );
}
