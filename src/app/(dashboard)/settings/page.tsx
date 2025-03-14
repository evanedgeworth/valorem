"use client";
import { useState } from "react";
import Password from "./password";
import Profile from "./profile";
import { Button, Card } from "flowbite-react";
import Company from "./company";
import Notification from "./notification";

export default function Settings() {
  const [selectedMenu, setSelectedMenu] = useState<string>("profile");

  return (
    <section className="w-full p-5">
      <Card className="mb-4">
        <div className="flex gap-1 -m-2">
          {
            [
              { label: 'Account', value: 'profile' },
              { label: 'Security', value: 'password' },
              // { label: 'Notifications', value: 'notifications' },
              // { label: 'Company Info', value: 'company' },
            ].map(item => (
              <Button
                key={item.label}
                color={selectedMenu === item.value ? 'gray' : 'transparent'}
                onClick={() => setSelectedMenu(item.value)}
              >
                {item.label}
              </Button>
            ))
          }
        </div>
      </Card>
      <Card>
        {selectedMenu === "profile" && <Profile />}
        {selectedMenu === "password" && <Password />}
        {selectedMenu === "company" && <Company />}
        {selectedMenu === "notifications" && <Notification />}
      </Card>
    </section>
  );
}
