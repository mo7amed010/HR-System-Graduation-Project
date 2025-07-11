import React, { useState } from "react";
import Swal from "sweetalert2";

const HolidayList = ({ holidays, onDelete, onEdit }) => {
  const [editHoliday, setEditHoliday] = useState(null);

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن يمكنك استرجاع الإجازة بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفها",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire("تم الحذف!", "تم حذف الإجازة بنجاح.", "success");
      }
    });
  };

  const handleEdit = (holiday) => {
    setEditHoliday(holiday);
    onEdit(holiday);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "عطلة دينية":
        return (
          <span className="badge bg-success">
            <i className="bi bi-star-fill me-1"></i>
            {type}
          </span>
        );
      case "عطلة وطنية":
        return (
          <span className="badge bg-primary">
            <i className="bi bi-flag-fill me-1"></i>
            {type}
          </span>
        );
      case "عطلة رسمية":
        return (
          <span className="badge bg-warning text-light">
            <i className="bi bi-bookmark-fill me-1"></i>
            {type}
          </span>
        );
      default:
        return <span className="badge bg-secondary">{type}</span>;
    }
  };

  return (
    <div
      className="card p-4 shadow-sm"
      style={{ borderColor: "#17A2B8", backgroundColor: "#F5F5F5" }}
    >
      <h4 className="text-center mb-4" style={{ color: "#004080" }}>
        <i className="bi bi-flag-fill ms-2"></i>
        سجل الإجازات الرسمية
      </h4>

      <table
        className="table table-bordered table-hover text-center align-middle"
        style={{ borderColor: "#17A2B8" }}
      >
        <thead>
          <tr>
            <th style={{ color: "#004080" }}>اسم الإجازة</th>
            <th style={{ color: "#004080" }}>النوع</th>
            <th style={{ color: "#004080" }}>التاريخ</th>
            <th style={{ color: "#004080" }}>المدة</th>
            <th style={{ color: "#004080" }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {holidays.length === 0 ? (
            <tr>
              <td colSpan="5">لا توجد إجازات مسجلة</td>
            </tr>
          ) : (
            holidays.map((holiday) => (
              <tr key={holiday._id}>
                <td>
                  <i className=" me-2 text-primary"></i>
                  {holiday.name}
                </td>
                <td>{getTypeBadge(holiday.type)}</td>
                <td>
                  <i className=" me-1 text-secondary"></i>
                  {holiday.date?.slice(0, 10)}
                </td>
                <td>{holiday.duration} يوم</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(holiday)}
                    >
                      <i className="bi bi-pencil-fill me-1"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(holiday._id)}
                    >
                      <i className="bi bi-trash-fill me-1"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HolidayList;
