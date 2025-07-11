import React, { useEffect, useState } from "react";
import {
  getHolidays,
  addHoliday,
  deleteHoliday,
  updateHoliday,
} from "../apis/officialholidays";
import HolidayForm from "./officialholidaysForm";
import HolidayList from "./officialholidaysList";

const HolidaysPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [editHoliday, setEditHoliday] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getHolidays();
      setHolidays(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (newHoliday) => {
    console.log("Sending data:", newHoliday);
    try {
      await addHoliday(newHoliday);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (updatedHoliday) => {
    try {
      let formattedHoliday = { ...updatedHoliday };
      if (formattedHoliday.date) {
        formattedHoliday.date = formattedHoliday.date.split("T")[0];
      }
      formattedHoliday.description = formattedHoliday.description || "";
      formattedHoliday.repeated = formattedHoliday.repeated || false;

      const id = formattedHoliday._id;
      const sendData = {
        name: formattedHoliday.name,
        date: formattedHoliday.date,
        type: formattedHoliday.type,
        duration: formattedHoliday.duration,
        description: formattedHoliday.description,
        repeated: formattedHoliday.repeated,
      };
      delete formattedHoliday._id;
      delete formattedHoliday.createdAt;
      delete formattedHoliday.updatedAt;
      delete formattedHoliday.__v;

      const response = await updateHoliday(id, sendData);
      setHolidays((prevHolidays) =>
        prevHolidays.map((holiday) =>
          holiday._id === id ? response.data.data : holiday
        )
      );
      setEditHoliday(null);
      fetchData();
    } catch (err) {
      console.error("خطأ في التحديث:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHoliday(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (holiday) => {
    setEditHoliday(holiday);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container py-4" style={{ backgroundColor: "#FFFFFF" }}>
      <h2 className="text-center mb-4" style={{ color: "#003366" }}>
        نظام إدارة الإجازات الرسمية
      </h2>
      <h6 className="text-center mb-4" style={{ color: "#004080" }}>
        {" "}
        إدارة العطل الرسمية والوطنية والدينية{" "}
      </h6>
      <div className="row mb-4 text-center">
        <div className="col-md-4">
          <div
            className="card"
            style={{
              backgroundColor: "rgba(255, 193, 7, 0.85)",
              color: "#FFF",
            }}
          >
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-center align-items-center gap-2">
                <i className="bi bi-clock-fill"></i>
                إجمالي الأيام
              </h5>
              <p className="card-text">
                {holidays.reduce((total, h) => total + h.duration, 0)} يوم
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card"
            style={{
              backgroundColor: "rgba(40, 167, 69, 0.85)",
              color: "#FFF",
            }}
          >
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-center align-items-center gap-2">
                <i className="bi bi-star-fill"></i>
                الإجازات الدينية
              </h5>
              <p className="card-text">
                {holidays.filter((h) => h.type === "عطلة دينية").length} إجازة
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card"
            style={{
              backgroundColor: "rgba(0, 123, 255, 0.85)",
              color: "#FFF",
            }}
          >
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-center align-items-center gap-2">
                <i className="bi bi-flag-fill"></i>
                الإجازات الوطنية
              </h5>
              <p className="card-text">
                {holidays.filter((h) => h.type === "عطلة وطنية").length} إجازة
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 order-md-1">
          <HolidayForm
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            editHoliday={editHoliday}
            holidays={holidays}
          />
        </div>
        <div className="col-md-8 order-md-2">
          <HolidayList
            holidays={holidays}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default HolidaysPage;
