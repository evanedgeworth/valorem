"use client";
import { Button, Checkbox, Label, TextInput, ToggleSwitch } from "flowbite-react";
import { useForm, SubmitHandler, Controller, Control } from "react-hook-form";
import { useEffect } from "react";
import request from "@/utils/request";
import { useToast } from "@/context/toastContext";

interface NotificationInputs {
  sistemUpdates: { value: boolean, inApp: boolean, email: boolean };
  accountActivity: { value: boolean, inApp: boolean, email: boolean };
  propertyWasAdded: { value: boolean, inApp: boolean, email: boolean };
  propertyWasUpdated: { value: boolean, inApp: boolean, email: boolean };
  propertyGotAssigned: { value: boolean, inApp: boolean, email: boolean };
  scopeWasCreated: { value: boolean, inApp: boolean, email: boolean };
  scopeWasUpdated: { value: boolean, inApp: boolean, email: boolean };
  scopeWasInitiated: { value: boolean, inApp: boolean, email: boolean };
  scopeWasRequested: { value: boolean, inApp: boolean, email: boolean };
}

function Switch({ control, label, description, name }: {
  control: Control<NotificationInputs, any>,
  label: string,
  description?: string,
  name: "sistemUpdates" | "accountActivity" | "propertyWasAdded" | "propertyWasUpdated" | "propertyGotAssigned"
  | "scopeWasCreated" | "scopeWasUpdated" | "scopeWasInitiated" | "scopeWasRequested",
}) {
  return (
    <div>
      <Controller
        control={control}
        name={`${name}.value`}
        render={({ field: { onChange, value } }) => (
          <div>
            <ToggleSwitch
              label={label}
              checked={value}
              onChange={onChange}
              color="dark"
            />
            <div className="ml-14">
              <p className="text-xs text-gray-400">{description}</p>
              {
                value && (
                  <div className="flex gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name={`${name}.inApp`}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <Checkbox checked={value} onChange={onChange} id={`${name}.inApp`} />
                            <Label htmlFor={`${name}.inApp`}>In-app</Label>
                          </>
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name={`${name}.email`}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <Checkbox checked={value} onChange={onChange} id={`${name}.email`} />
                            <Label htmlFor={`${name}.email`}>Email</Label>
                          </>
                        )}
                      />
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default function Notification() {
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<NotificationInputs>({
    defaultValues: {
      sistemUpdates: { value: false, inApp: false, email: false },
      accountActivity: { value: false, inApp: false, email: false },
    },
  });

  useEffect(() => {
    async function fetchCompanyInfo() {
      const res = await request({ method: "GET", url: "/company/info" });
      if (res.status === 200) {

      }
    }
    fetchCompanyInfo();
  }, [setValue]);

  const onSubmit: SubmitHandler<NotificationInputs> = async (data) => {
    const res = await request({
      method: "PUT",
      url: "/company/info",
      data,
    });

    if (res.status === 200) {
      showToast("Successfully updated company info", "success");
    } else {
      showToast(res.data.message || "Failed to update", "error");
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold leading-tight tracking-tight">Notifications</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
        <div className="grid gap-4">
          <div>
            <p className="font-bold">General</p>
          </div>
          <Switch
            control={control}
            label="System updates"
            description="Get Valorem news, announcements, and product updates"
            name="sistemUpdates"
          />
          <Switch
            control={control}
            label="Account Activity"
            description="Get important notifications about you or activity you've missed"
            name="accountActivity"
          />
          <div>
            <p className="font-bold">Properties</p>
          </div>
          <Switch
            control={control}
            label="Property was added"
            name="propertyWasAdded"
          />
          <Switch
            control={control}
            label="Property was updated"
            name="propertyWasUpdated"
          />
          <Switch
            control={control}
            label="Property got assigned a project manager"
            name="propertyGotAssigned"
          />
          <div>
            <p className="font-bold">Scope</p>
          </div>
          <Switch
            control={control}
            label="Scope was created"
            name="scopeWasCreated"
          />
          <Switch
            control={control}
            label="Scope was updated"
            name="scopeWasUpdated"
          />
          <Switch
            control={control}
            label="Scope was initiated"
            name="scopeWasInitiated"
          />
          <Switch
            control={control}
            label="Scope was requested a review"
            name="scopeWasRequested"
          />
        </div>
        <div className="border-t border-t-gray-200 pt-4 dark:border-t-gray-600">
          <Button type="submit" isProcessing={isSubmitting} color="gray">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
