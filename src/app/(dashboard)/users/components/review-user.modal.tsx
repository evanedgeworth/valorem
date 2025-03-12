import { useToast } from "@/context/toastContext";
import { UserOrganization } from "@/types";
import { getFullName, groupBy } from "@/utils/commonUtils";
import request from "@/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Modal } from "flowbite-react";

export default function ReviewUserModal({ open, onClose, userOrganization, onSuccess }: {
  open: boolean;
  onClose: () => void,
  userOrganization: UserOrganization | null;
  onSuccess: () => void,
}) {
  const { showToast } = useToast();

  const { data } = useQuery({
    queryKey: ['user-details', userOrganization?.userId],
    queryFn: async () => {
      const res = await request({
        url: `/profiles/${userOrganization?.userId}`,
        params: {
          includeMarkets: true
        },
        method: "GET",
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(userOrganization?.userId) && open
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await request({
        url: `/profiles/${userOrganization?.userId}/status`,
        method: 'PATCH',
        data: { status: 'ACTIVE' }
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess: () => {
      showToast('Successfully updated data.');
      onClose();
      onSuccess();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    }
  });

  const reajectMutation = useMutation({
    mutationFn: async () => {
      const res = await request({
        url: `/profiles/${userOrganization?.userId}/status`,
        method: 'PATCH',
        data: { status: 'INACTIVE' }
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess: () => {
      showToast('Successfully updated data.');
      onClose();
      onSuccess();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    }
  });

  const handleReject = () => {
    reajectMutation.mutate();
  }

  const handleApprove = () => {
    approveMutation.mutate();
  }
 
  const markets: string[] = groupBy(data?.markets || [], 'city').map(item => item.key);

  const items = [
    { label: 'Full name', value: getFullName(userOrganization?.user) },
    { label: 'Email', value: userOrganization?.user?.email },
    { label: 'User role', value: userOrganization?.role?.roleName },
    { label: 'Company name', value: userOrganization?.name },
    { label: 'Markets', value: markets.join(', ') },
  ];

  return (
    <Modal show={open} size="md" onClose={() => onClose()} dismissible>
      <Modal.Header className="items-center px-6 pt-4">
        <h3 className="text-xl font-medium">Review request</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="grid gap-4">
          {
            items.map(item => (
              <div key={item.label}>
                <p className="text-sm">{item.label}</p>
                <p className="text-sm text-gray-400 mt-2">{item.value || ''}</p>
              </div>
            ))
          }
        </div>
      </Modal.Body>
      <Modal.Footer className="grid grid-cols-2 gap-2"> 
        <Button color="gray" fullSized outline onClick={handleReject}>Reject</Button>
        <Button color="gray" isProcessing={approveMutation.isPending} fullSized onClick={handleApprove}>Approve</Button>
      </Modal.Footer>
    </Modal>
  );
}
