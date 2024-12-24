const data = {
    phase1: ["Anatomy", "Physiology", "Biochemistry", "Community Medicine", "Foundation Course", "ECA", "PCA"],
    phase2: ["Community Medicine", "Pathology", "Microbiology", "Pharmacology", "Forensic Medicine & Toxicology", "Medicine", "Surgery", "Obs & GYN", "ECA"],
    phase3p1: ["Community Medicine", "Forensic Medicine & Toxicology", "Medicine", "Surgery", "Paediatrics", "Orthopaedics", "Ophthalmology", "ENT", "Obs & GYN"],
    phase3p2: ["Medicine", "Surgery", "Obs & GYN", "Psychiatry", "Dermatology", "Radiology", "Paediatrics", "Orthopaedics", "ENT", "Anaesthesiology", "Ophthalmology"]
  };
  
  const teachers = [
    "Teacher A", "Teacher B", "Teacher C", "Teacher D", "Teacher E",
    "Teacher F", "Teacher G", "Teacher H", "Teacher I", "Teacher J", "Teacher K"
  ];
  
  const lectureTypes = ["Lecture", "Practical", "Morning Posting", "Family Adoption Program", "Self Directed Learning", "Small GP Discussion", "AETCOM", "Pandemic Module", "Sports/Yoga", "Elective"];
  const timeSlots = [
    "9:00 AM - 9:50 AM", "10:00 AM - 10:50 AM", "11:00 AM - 11:50 AM",
    "12:00 PM - 12:50 PM", "1:00 PM - 1:50 PM (Lunch Break)",
    "2:00 PM - 2:50 PM", "3:00 PM - 3:50 PM", "4:00 PM - 4:50 PM"
  ];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  let absentTeachers = [];
  const teacherAssignments = {};
  
  function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.classList.toggle('show');
  }
  
  function populateTeacherDropdown() {
    const teacherList = document.getElementById('teacher-list');
    teacherList.innerHTML = teachers
      .map(
        teacher => `
          <li>
            <input type="checkbox" value="${teacher}" onchange="updateAbsentTeachers()">
            <label>${teacher}</label>
          </li>`
      )
      .join('');
  }
  
  function updateAbsentTeachers() {
    absentTeachers = Array.from(document.querySelectorAll('#teacher-list input:checked'))
      .map(input => input.value);
  
    reassignAbsentTeacherSlots();
  }
  
  function reassignAbsentTeacherSlots() {
    for (const phase in teacherAssignments) {
      for (const day in teacherAssignments[phase]) {
        for (const timeSlot in teacherAssignments[phase][day]) {
          const assignedTeacher = teacherAssignments[phase][day][timeSlot];
  
          if (absentTeachers.includes(assignedTeacher)) {
            const availableTeacher = teachers.find(teacher =>
              !absentTeachers.includes(teacher) &&
              !Object.values(teacherAssignments[phase][day]).includes(teacher)
            );
  
            if (availableTeacher) {
              teacherAssignments[phase][day][timeSlot] = availableTeacher;
              alert(
                `Teacher ${assignedTeacher} is absent. Slot reassigned to ${availableTeacher} for ${timeSlot} on ${day}.`
              );
            }
          }
        }
      }
    }
  
    displayTimetable();
  }
  
  function displayTimetable() {
    const phase = document.getElementById('phase-select').value;
    const timetableContainer = document.getElementById('timetable-container');
    timetableContainer.innerHTML = '';
  
    if (!phase) {
      timetableContainer.style.display = 'none';
      return;
    }
  
    timetableContainer.style.display = 'block';
  
    const table = document.createElement('table');
    table.className = 'table';
  
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Time Slot</th>
      ${days.map(day => `<th>${day}</th>`).join('')}
    `;
    table.appendChild(headerRow);
  
    const subjects = data[phase];
    const randomizedSubjects = days.map(() => shuffleArray([...subjects]));
  
    timeSlots.forEach((timeSlot, slotIndex) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td class="time-slot">${timeSlot}</td>`;
  
      days.forEach((day, dayIndex) => {
        if (timeSlot.includes("Lunch Break")) {
          row.innerHTML += `<td colspan="1" style="font-style: italic; text-align: center;">Lunch Break</td>`;
        } else {
          const subject = randomizedSubjects[dayIndex][slotIndex % subjects.length];
          const teacher = teacherAssignments[phase]?.[day]?.[timeSlot] || '';
  
          row.innerHTML += `
            <td>
              <div>${subject}</div>
              <select>
                ${lectureTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
              </select>
              <select onchange="assignTeacher('${day}', '${timeSlot}', '${phase}', this)">
                <option value="">--Select Teacher--</option>
                ${teachers.map(t => `<option value="${t}" ${t === teacher ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </td>
          `;
        }
      });
  
      table.appendChild(row);
    });
  
    timetableContainer.appendChild(table);
  }
  
  function assignTeacher(day, timeSlot, phase, selectElement) {
    const teacher = selectElement.value;
  
    if (!teacherAssignments[phase]) teacherAssignments[phase] = {};
    if (!teacherAssignments[phase][day]) teacherAssignments[phase][day] = {};
  
    for (const otherPhase in teacherAssignments) {
      if (otherPhase !== phase && teacherAssignments[otherPhase]?.[day]?.[timeSlot] === teacher) {
        alert(`Teacher ${teacher} is already assigned in ${otherPhase} for ${timeSlot} on ${day}. Please select a different teacher.`);
        selectElement.value = '';
        return;
      }
    }
  
    teacherAssignments[phase][day][timeSlot] = teacher;
  }
  
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function toggleDarkMode() {
    const isChecked = document.getElementById('dark-mode-checkbox').checked;
    document.body.classList.toggle('dark-mode', isChecked);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    populateTeacherDropdown();
  });
  