"use client";
import Footer from "@/app/components/Footer";
import PickupScheduleCalendar from "@/app/components/Calender";
import React from "react";
import CozeChat from "@/app/components/CozeAi";

const page = () => {
  return (
    <div>
      <PickupScheduleCalendar />
      <CozeChat/>
      <Footer />
    </div>
  );
};

export default page;
