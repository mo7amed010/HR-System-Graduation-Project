import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Setting.module.css';
import {FaTrash, FaSave
} from "react-icons/fa";

const Setting = () => {
  const daysOfWeek = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس', 'الجمعة','السبت'];
  return (
    <div className={`container mt-4 ${styles.container}`} dir="rtl">
      <h1 className={`text-center p-2 rounded ${styles.title}`}>إعدادات عامة</h1>
      
      <form>
        <div className={`mb-4 ${styles.section}`}>
          <div className="row g-3">
            <div className="col-12">
              <div className={`mb-2 ${styles.inputGroup}`}>
                <label className={`form-label ${styles.label}`}>الإضافة:</label>
                <input
                  type="text"
                  className={`form-control ${styles.input}`}
                  placeholder="  قيمة الخصم"
                />
              </div>
              <div className={`mb-2 ${styles.inputGroup}`}>
                <label className={`form-label ${styles.label}`}> الخصم:</label>
                <input
                  type="text"
                  className={`form-control ${styles.input}`}
                  placeholder="  قيمة الإضافة"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`mb-4 ${styles.section}`}>
          <h2 className={`h5 mb-3 ${styles.sectionTitle}`}>الإجازات الأسبوعية</h2>
          <div className="row g-3">
            {[0, 1].map((index) => (
              <div className="col-12" key={index}>
                <div className={`mb-2 ${styles.inputGroup}`}>
                  <label className={`form-label ${styles.label}`}>يوم الاجازه الرسمي  </label>
                  <select className={`form-select ${styles.customSelect}`}>
                    <option value="">اختر يوم الإجازة</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`d-flex justify-content-center gap-3 ${styles.buttonGroup}`}>
           <button type="submit"className={`btn ${styles.button} ${styles.buttonSave}`} >
          <FaSave /> حفظ
          </button>
          <button type="button" className={`btn ${styles.button} ${styles.buttonDelete}`} >
          <FaTrash /> حذف
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;