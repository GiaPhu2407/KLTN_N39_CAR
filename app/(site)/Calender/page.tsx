"use client";
import Footer from "@/app/components/Footer";
import PickupScheduleCalendar from "@/app/components/Calender";
import React from "react";

const page = () => {
  return (
    <div>
      <PickupScheduleCalendar />
      <Footer />
    </div>
  );
};

export default page;
