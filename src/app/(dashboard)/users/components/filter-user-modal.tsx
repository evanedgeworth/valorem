import MultiSelect from "@/components/multi-select";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";

const roleOptions = [
  {
    "label": "Executive",
    "value": "EXECUTIVE"
  },
  {
    "label": "Operations",
    "value": "OPERATIONS"
  },
  {
    "label": "Senior Project Manager",
    "value": "SENIOR PROJECT MANAGER"
  },
  {
    "label": "Project Manager",
    "value": "PROJECT MANAGER"
  },
  {
    "label": "Junior Project Manager",
    "value": "JUNIOR PROJECT MANAGER"
  },
  {
    "label": "Accountant",
    "value": "ACCOUNTANT"
  },
  {
    "label": "Client",
    "value": "CLIENT"
  }
];


export default function FilterUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  
  const [statuses, setStatuses] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  const handleReset = () => {

  }

  const handleSubmit = () => {

  }

  return (
    <Modal show={open} size="md" onClose={() => onClose()} dismissible>
      <Modal.Header className="items-center px-6 pt-4">
        <h3 className="text-xl font-medium">Filter</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="grid gap-4">
          <MultiSelect
            label="Organization"
            options={[]}
            onChange={() => { }}
            placeholder="Select all organizations"
          />
          <MultiSelect
            label="User role"
            options={roleOptions}
            onChange={(value) => setRoles(value)}
            placeholder="Select all roles"
          />
          <MultiSelect
            label="Market"
            options={roleOptions}
            onChange={() => { }}
            placeholder="Select all markets"
          />
          <MultiSelect
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
            ]}
            onChange={(value) => setStatuses(value)}
            placeholder="Select all statuses"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={handleSubmit}>Save</Button>
        <Button color="gray" outline onClick={handleReset}>Reset</Button>
      </Modal.Footer>
    </Modal>
  );
}
