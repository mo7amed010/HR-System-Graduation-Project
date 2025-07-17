const EmployeeModel = require("../Models/employee");
const AttendanceModel = require("../Models/attendance");
const GeneralSettingModel = require("../Models/GeneralSitting");
const OfficialHolidaysModel = require("../Models/officialHolidays");
const dayjs = require("dayjs");

class SummaryService {
  /**
   * Generate a comprehensive employee summary
   * @param {string} employeeId - The employee ID
   * @param {string} month - Optional month in YYYY-MM format, defaults to current month
   * @param {boolean} isCurrentMonth - Whether this is the current month
   * @returns {Object} Employee summary with stats and natural language description
   */
  static async generateEmployeeSummary(employeeId, month = null, isCurrentMonth = false) {
    try {
      // Get employee data
      const employee = await EmployeeModel.findById(employeeId)
        .populate("department", "name")
        .lean();

      if (!employee) {
        throw new Error("Employee not found");
      }

      // Get weekly holidays from settings
      const settings = await GeneralSettingModel.findOne();
      let weeklyHolidays = [];
      if (settings) {
        if (settings.offDay1) weeklyHolidays.push(settings.offDay1);
        if (settings.offDay2) weeklyHolidays.push(settings.offDay2);
      }

      // Determine the month to analyze
      const targetMonth = month || dayjs().format("YYYY-MM");
      const startOfMonth = dayjs(targetMonth + "-01").startOf("month").toDate();
      const endOfMonth = dayjs(targetMonth + "-01").endOf("month").toDate();

      // Get official holidays in the range
      const holidays = await OfficialHolidaysModel.find({
        date: { $gte: startOfMonth, $lte: endOfMonth }
      }).lean();
      // Build a set of all holiday dates (as YYYY-MM-DD strings)
     // Build a set of all holiday dates (as YYYY-MM-DD strings)
const officialHolidayDates = new Set();

holidays.forEach((h) => {
  const start = dayjs(h.date);
  const duration = h.duration || 1;

  for (let i = 0; i < duration; i++) {
    const day = start.add(i, 'day').format("YYYY-MM-DD");
    officialHolidayDates.add(day);}
});

      // Get attendance data for the month
      const attendanceData = await this.getAttendanceStats(
        employeeId,
        startOfMonth,
        endOfMonth,
        isCurrentMonth,
        weeklyHolidays,
        officialHolidayDates
      );

      // Generate natural language summary
      const summary = this.generateNaturalLanguageSummary(
        employee,
        attendanceData
      );

      return {
        employee: {
          id: employee._id,
          name: employee.name,
          department: employee.department?.name || "Unknown",
          jobTitle: employee.jobTitle,
        },
        period: {
          month: targetMonth,
          startDate: startOfMonth,
          endDate: endOfMonth,
        },
        stats: {
          attendance: attendanceData,
        },
        summary: summary,
      };
    } catch (error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  /**
   * Get attendance statistics for a given period
   */
  static async getAttendanceStats(employeeId, startDate, endDate, isCurrentMonth = false, weeklyHolidays = [], officialHolidayDates = new Set()) {
    // If it's the current month, only count days up to today
    let effectiveEndDate = endDate;
    if (isCurrentMonth) {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      effectiveEndDate = today < endDate ? today : endDate;
    }

    const attendanceRecords = await AttendanceModel.find({
      employeeId,
      date: { $gte: startDate, $lte: effectiveEndDate },
    }).lean();

    // Calculate total working days (excluding weekends and holidays)
    const totalDays = this.calculateWorkingDays(startDate, effectiveEndDate, weeklyHolidays, officialHolidayDates);
    const presentDays = attendanceRecords.length;
    const absentDays = Math.max(totalDays - presentDays,0);
    const lateDays = attendanceRecords.filter(record => record.lateMinutes > 0).length;
    const totalLateMinutes = attendanceRecords.reduce((sum, record) => sum + (record.lateMinutes || 0), 0);
    const totalOvertimeMinutes = attendanceRecords.reduce((sum, record) => sum + (record.overtimeMinutes || 0), 0);

   const attendancePercentage = totalDays > 0
  ? Math.min(Math.round((presentDays / totalDays) * 100),100):0;

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      totalLateMinutes,
      totalOvertimeMinutes,
      attendancePercentage,
    };
  }

  /**
   * Calculate working days between two dates (excluding weekly holidays and official holidays)
   */
  static calculateWorkingDays(startDate, endDate, weeklyHolidays = [], officialHolidayDates = new Set()) {
    let workingDays = 0;
    let current = dayjs(startDate);
    const end = dayjs(endDate);

    // دعم العربية والإنجليزية والحروف الكبيرة/الصغيرة
    const dayMap = {
      'saturday': ['saturday', 'السبت'],
      'sunday': ['sunday', 'الأحد', 'الاحد'],
      'monday': ['monday', 'الاثنين', 'الإثنين'],
      'tuesday': ['tuesday', 'الثلاثاء'],
      'wednesday': ['wednesday', 'الأربعاء', 'الاربعاء'],
      'thursday': ['thursday', 'الخميس'],
      'friday': ['friday', 'الجمعة']
    };

    // بناء قائمة موحدة لكل أيام الإجازة الأسبوعية
    let holidays = [];
    for (const day of weeklyHolidays) {
      const d = day.toString().trim().toLowerCase();
      for (const [eng, arrs] of Object.entries(dayMap)) {
        if (arrs.includes(d) || eng === d) {
          holidays.push(eng); // نستخدم الإنجليزي كمرجع موحد
        }
      }
    }

    while (current.isBefore(end) || current.isSame(end, 'day')) {
      // اسم اليوم بالإنجليزي (صغير)
      const dayName = current.format('dddd').toLowerCase();
      const dateStr = current.format('YYYY-MM-DD');
      if (!holidays.includes(dayName) && !officialHolidayDates.has(dateStr)) {
        workingDays++;
      }
      current = current.add(1, 'day');
    }

    return workingDays;
  }

  /**
   * Generate natural language summary based on employee data
   */
  static generateNaturalLanguageSummary(employee, attendanceData) {
    const { name } = employee;
    const { attendancePercentage, presentDays, absentDays, lateDays, totalLateMinutes } = attendanceData;

    let summary = `${name} `;

    // Attendance assessment in Arabic
    if (attendancePercentage >= 95) {
      summary += "كان ملتزمًا هذا الشهر بنسبة حضور ";
    } else if (attendancePercentage >= 90) {
      summary += "كان منتظمًا في الحضور هذا الشهر بنسبة ";
    } else if (attendancePercentage >= 80) {
      summary += "كان مقبولاً في الحضور هذا الشهر بنسبة ";
    } else {
      summary += "كان ضعيفًا في الحضور هذا الشهر بنسبة ";
    }

    summary += `${attendancePercentage}%`;

    // Add specific details in Arabic
    const details = [];
    
    if (absentDays > 0) {
      if (absentDays === 1) {
        details.push("تغيب يوم واحد");
      } else if (absentDays === 2) {
        details.push("تغيب يومين");
      } else if (absentDays >= 3 && absentDays <= 10) {
        details.push(`تغيب ${absentDays} أيام`);
      } else {
        details.push(`تغيب ${absentDays} يوم`);
      }
    }
    
    if (lateDays > 0) {
      if (lateDays === 1) {
        details.push("تأخر مرة واحدة");
      } else if (lateDays === 2) {
        details.push("تأخر مرتين");
      } else if (lateDays >= 3 && lateDays <= 10) {
        details.push(`تأخر ${lateDays} مرات`);
      } else {
        details.push(`تأخر ${lateDays} مرة`);
      }
    }

    if (details.length > 0) {
      summary += `. ${details.join(". ")}`;
    } else {
      summary += ". لم يتغيب";
    }

    // Overall performance assessment in Arabic
    let performanceRating;
    if (attendancePercentage >= 95) {
      performanceRating = "ممتاز";
    } else if (attendancePercentage >= 90) {
      performanceRating = "جيد جداً";
    } else if (attendancePercentage >= 80) {
      performanceRating = "جيد";
    } else if (attendancePercentage >= 70) {
      performanceRating = "مقبول";
    } else {
      performanceRating = "ضعيف";
    }

    summary += ` الأداء العام: ${performanceRating}.`;

    // Force: Always log and return Arabic summary
    console.log('Arabic Summary:', summary);
    return summary;
  }
}

module.exports = SummaryService; 