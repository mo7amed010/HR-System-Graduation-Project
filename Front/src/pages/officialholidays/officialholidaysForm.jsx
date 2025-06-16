import React from "react";
import { useForm } from "react-hook-form";

const HolidayForm = ({ onAdd, onUpdate, editHoliday, holidays }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  React.useEffect(() => {
    if (editHoliday) {
      setValue("name", editHoliday.name);
      setValue("type", editHoliday.type);
      const formattedDate = editHoliday.date?.slice(0, 10) || "";
      setValue("date", formattedDate);
      setValue("duration", editHoliday.duration);
      setValue("description", editHoliday.description);
      setValue("repeated", editHoliday.repeated);
    }
  }, [editHoliday, setValue]);

  const onSubmit = (data) => {
    data.duration = parseInt(data.duration);
    data.date = data.date.split("T")[0];
    const isDuplicate = holidays.some(
      (holiday) =>
        holiday.name === data.name &&
        holiday.date === data.date &&
        holiday.type === data.type &&
        !editHoliday
    );

    if (isDuplicate && !editHoliday) {
      alert("هذه الإجازة موجودة بالفعل!");
      return;
    }

    if (editHoliday) {
      const updatedHoliday = { ...editHoliday, ...data, _id: editHoliday._id };
      onUpdate(updatedHoliday);
    } else {
      onAdd(data);
    }
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card p-4 shadow-sm"
      style={{ borderColor: "#17A2B8", backgroundColor: "#F5F5F5" }}
    >
      <h4
        className="mb-3"
        style={{ color: editHoliday ? "#004080" : "#004080" }}
      >
        <i
          className={`bi ${
            editHoliday ? "bi-pencil-square" : "bi-plus-square-fill"
          } ms-2`}
        ></i>
        {editHoliday ? "تعديل الإجازة" : "إضافة إجازة رسمية"}
      </h4>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#000" }}>
          اسم الإجازة
        </label>
        <input
          className="form-control"
          style={{ borderColor: "#17A2B8" }}
          {...register("name", { required: "اسم الإجازة مطلوب" })}
        />
        {errors.name && (
          <small className="text-danger">{errors.name.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#000" }}>
          نوع الإجازة
        </label>
        <select
          className="form-select"
          style={{ borderColor: "#17A2B8" }}
          {...register("type", { required: true })}
        >
          <option value="عطلة دينية">عطلة دينية</option>
          <option value="عطلة وطنية">عطلة وطنية</option>
          <option value="عطلة رسمية">عطلة رسمية</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#000" }}>
          تاريخ الإجازة
        </label>
        <input
          type="date"
          className="form-control"
          style={{ borderColor: "#17A2B8" }}
          {...register("date", { required: "تاريخ الإجازة مطلوب" })}
        />
        {errors.date && (
          <small className="text-danger">{errors.date.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#000" }}>
          مدة الإجازة (بالأيام)
        </label>
        <input
          type="number"
          className="form-control"
          style={{ borderColor: "#17A2B8" }}
          min="1"
          {...register("duration", {
            required: "مدة الإجازة مطلوبة",
            min: { value: 1, message: "يجب أن تكون يومًا على الأقل" },
          })}
        />
        {errors.duration && (
          <small className="text-danger">{errors.duration.message}</small>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        style={{ backgroundColor: "#004080", borderColor: "#007BFF" }}
      >
        {editHoliday ? "حفظ التعديل" : "إضافة"}
      </button>
    </form>
  );
};

export default HolidayForm;
